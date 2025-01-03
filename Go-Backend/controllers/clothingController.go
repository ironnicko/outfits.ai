package controllers

import (
	"encoding/json"
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

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/supabase-community/auth-go/types"
	"gorm.io/gorm"
)

func ErrorRollBack(c *fiber.Ctx, db *gorm.DB, clothingID uint, errorMessage string) error {
	if db != nil {
		db.Delete(&models.Clothing{}, clothingID)
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": errorMessage})
}
func CreateMultiPartFormBody(strUID uuid.UUID, strCID string, clothingType string, writer *multipart.Writer, fileBuffer *bytes.Buffer, fileHeader *multipart.FileHeader) {
	// Create a new multipart request to send the file to the FastAPI server

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {

	}

	// Copy the file buffer to the multipart form part
	io.Copy(part, fileBuffer)

	writer.WriteField("user_ID", strUID.String())

	writer.WriteField("clothing_ID", strCID)

	// Close the writer to finalize the multipart form
	writer.Close()
}

func SendRequest(url string, body *bytes.Buffer, writer *multipart.Writer) ([]byte, error) {
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return []byte{}, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []byte{}, err
	}
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return []byte{}, err
	}
	defer resp.Body.Close()

	return respBody, nil

}

func CreateClothing(c *fiber.Ctx) error {
	user := c.Locals("user").(types.UserResponse)
	db := configs.DB.Db
	clothing := models.Clothing{}

	if err := c.BodyParser(&clothing); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	clothing.UserID = user.ID

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

	strCID := strconv.FormatUint(uint64(clothing.ID), 10)

	CreateMultiPartFormBody(user.ID, strCID, clothing.ClothingType, writer, &fileBuffer, fileHeader)

	// Send the POST request to the FastAPI server
	url := os.Getenv("SEGMENT_URL") + ":8001/upload"
	respBody, err := SendRequest(url, body, writer)
	if err != nil {
		ErrorRollBack(c, db, clothing.ID, err.Error())
	}
	// Parse the JSON response
	var fastAPIResponse struct {
		Tags      []string `json:"Tags"`
		Status    string   `json:"status"`
		Embedding string   `json:"Embedding"`
		Text      string   `json:"text"`
		Type      string   `json:"clothingType"`
		Color     string   `json:"color"`
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
	db.Exec(query, user.ID, clothing.ID, fastAPIResponse.Embedding, fastAPIResponse.Text, time.Now(), time.Now())

	clothing.ClothingType = fastAPIResponse.Type
	clothing.ClothingColor = fastAPIResponse.Color
	bucket := strings.Join([]string{os.Getenv("BUCKET_PREFIX"), user.ID.String(), clothing.ClothingType, strCID + ".png"}, "/")
	clothing.ClothingURL = bucket
	db.Save(&clothing)

	return c.Status(fiber.StatusAccepted).Send(respBody)
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
	user := c.Locals("user").(types.UserResponse)
	clothings := []models.Clothing{}
	db.Where("user_id = ?", user.ID.String()).Find(&clothings)

	responseClothings := []GetClothing{}
	tags := []models.Tags{}
	for _, clothing := range clothings {
		db.Where("clothing_id = ?", clothing.ID).Find(&tags)
		responseClothing := CreateResponseClothing(clothing, tags)
		responseClothings = append(responseClothings, responseClothing)
	}

	return c.JSON(responseClothings)
}
