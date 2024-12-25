package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	configs "outfits/config"
	"outfits/models"
	"strconv"
	"strings"
	"time"

	"bytes"
	"io"
	"mime/multipart"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func formatEmbeddingForSQL(embedding []float64) string {
	var sb strings.Builder
	sb.WriteString("[")
	for i, val := range embedding {
		sb.WriteString(fmt.Sprintf("%f", val))
		if i < len(embedding)-1 {
			sb.WriteString(", ")
		}
	}
	sb.WriteString("]")
	return sb.String()
}

func ErrorRollBack(c *fiber.Ctx, db *gorm.DB, clothingID uint, errorMessage string) error {
	if db != nil {
		db.Delete(&models.Clothing{}, clothingID)
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": errorMessage})
}
func CreateMultiPartFormBody(user models.User, clothing models.Clothing, writer *multipart.Writer, fileBuffer *bytes.Buffer, fileHeader *multipart.FileHeader) {
	// Create a new multipart request to send the file to the FastAPI server

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {

	}

	// Copy the file buffer to the multipart form part
	io.Copy(part, fileBuffer)

	strUID := strconv.FormatUint(uint64(user.ID), 10)
	strCID := strconv.FormatUint(uint64(clothing.ID), 10)

	writer.WriteField("user_ID", strUID)

	writer.WriteField("clothing_ID", strCID)

	writer.WriteField("type", clothing.ClothingType)

	// Close the writer to finalize the multipart form
	writer.Close()
}

func CreateClothing(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	db := configs.DB.Db
	clothing := models.Clothing{}

	if err := c.BodyParser(&clothing); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	clothing.UserID = user.ID
	clothing.ClothingType = c.FormValue("type")

	strUID := strconv.FormatUint(uint64(user.ID), 10)
	strCID := strconv.FormatUint(uint64(clothing.ID), 10)

	validate := validator.New()

	if err := validate.Struct(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	result := db.Create(&clothing)
	if result.Error != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": result.Error,
		})
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to Parse File")
	}

	// Open the file in memory
	file, err := fileHeader.Open()
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return ErrorRollBack(c, db, clothing.ID, "Failed to Open File")
	}
	defer file.Close()

	// Create a buffer to hold the file contents
	var fileBuffer bytes.Buffer
	_, err = io.Copy(&fileBuffer, file)
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to Copy File to Buffer")
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	CreateMultiPartFormBody(user, clothing, writer, &fileBuffer, fileHeader)

	// Send the POST request to the FastAPI server
	url := os.Getenv("SEGMENT_URL") + ":8001/upload"
	fmt.Println(url)
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to create POST request")
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to send POST request")
	}
	defer resp.Body.Close()

	// Read the FastAPI server's response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to Read Reponse from Segment")
	}

	// Parse the JSON response
	var fastAPIResponse struct {
		Tags      []string  `json:"Tags"`
		Status    string    `json:"status"`
		Embedding []float64 `json:"Embedding"`
		Text      string    `json:"text"`
	}
	if err := json.Unmarshal(respBody, &fastAPIResponse); err != nil {
		return ErrorRollBack(c, db, clothing.ID, "Failed to Parse JSON Response")
	}

	// Save Tags to the database
	for _, tagName := range fastAPIResponse.Tags {
		tag := models.Tags{
			TagName:    tagName,
			ClothingID: clothing.ID,
		}
		if err := db.Create(&tag).Error; err != nil {
			return ErrorRollBack(c, db, clothing.ID, "Failed to Save Tags to Database")
		}
	}

	// Save Vector to the Database
	query := "INSERT INTO vectors (user_id, clothing_id, embedding, text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
	db.Exec(query, user.ID, clothing.ID, formatEmbeddingForSQL(fastAPIResponse.Embedding), fastAPIResponse.Text, time.Now(), time.Now())

	bucket := strings.Join([]string{os.Getenv("BUCKET_PREFIX"), strUID, clothing.ClothingType, strCID + ".png"}, "/")
	clothing.ClothingURL = bucket
	db.Save(&clothing)

	return c.Status(resp.StatusCode).Send(respBody)
}

type GetTags struct {
	TagID   uint
	TagName string
}

type GetClothing struct {
	Color string
	Type  string
	URL   string
	ID    uint
	Tags  []GetTags
}

func CreateResponseClothing(clothing models.Clothing, tags []models.Tags) GetClothing {
	response := GetClothing{}
	response.Color = clothing.ClothingColor
	response.Type = clothing.ClothingType
	response.URL = clothing.ClothingURL
	response.ID = clothing.ID
	tagInstance := GetTags{}

	for _, tag := range tags {
		tagInstance.TagID = tag.ID
		tagInstance.TagName = tag.TagName
		response.Tags = append(response.Tags, tagInstance)
	}

	return response
}

func GetClothings(c *fiber.Ctx) error {
	db := configs.DB.Db
	user := c.Locals("user").(models.User)
	clothings := []models.Clothing{}
	db.Where("user_id = ?", user.ID).Find(&clothings)
	responseClothings := []GetClothing{}
	tags := []models.Tags{}
	for _, clothing := range clothings {
		db.Where("clothing_id = ?", clothing.ID).Find(&tags)
		responseClothing := CreateResponseClothing(clothing, tags)
		responseClothings = append(responseClothings, responseClothing)
	}

	return c.JSON(responseClothings)
}
