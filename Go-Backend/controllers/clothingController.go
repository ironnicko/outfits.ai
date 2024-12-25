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

func CreateClothing(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	db := configs.DB.Db
	clothing := models.Clothing{}

	if err := c.BodyParser(&clothing); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	clothing.UserID = user.ID
	clothing.ClothingType = c.FormValue("type")

	validate := validator.New()

	if err := validate.Struct(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	result := db.Create(&clothing)
	if result.Error != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": false,
			"result": result.Error,
		})
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse file",
		})
	}

	// Open the file in memory
	file, err := fileHeader.Open()
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to open file",
		})
	}
	defer file.Close()

	// Create a buffer to hold the file contents
	var fileBuffer bytes.Buffer
	_, err = io.Copy(&fileBuffer, file)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to copy file to buffer",
		})
	}

	// Create a new multipart request to send the file to the FastAPI server
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create form file",
		})
	}

	// Copy the file buffer to the multipart form part
	_, err = io.Copy(part, &fileBuffer)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to copy file to multipart writer",
		})
	}

	strUID := strconv.FormatUint(uint64(user.ID), 10)
	strCID := strconv.FormatUint(uint64(clothing.ID), 10)

	err = writer.WriteField("user_ID", strUID)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to write user_ID"})
	}

	err = writer.WriteField("clothing_ID", strCID)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to write user_ID"})
	}
	err = writer.WriteField("type", clothing.ClothingType)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to write user_ID"})
	}

	// Close the writer to finalize the multipart form
	writer.Close()

	// Send the POST request to the FastAPI server
	url := os.Getenv("SEGMENT_URL") + ":8001/upload"
	fmt.Println(url)
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create POST request",
		})
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to send POST request",
		})
	}
	defer resp.Body.Close()

	// Read the FastAPI server's response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read response from FastAPI server",
		})
	}

	// Parse the JSON response
	var fastAPIResponse struct {
		Tags      []string  `json:"Tags"`
		Status    string    `json:"status"`
		Embedding []float64 `json:"Embedding"`
		Text      string    `json:"text"`
	}
	if err := json.Unmarshal(respBody, &fastAPIResponse); err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to parse JSON response",
		})
	}

	// Save Tags to the database
	for _, tagName := range fastAPIResponse.Tags {
		tag := models.Tags{
			TagName:    tagName,
			ClothingID: clothing.ID,
		}
		if err := db.Create(&tag).Error; err != nil {
			db.Delete(&models.Clothing{}, clothing.ID)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to save tag to database",
			})
		}
	}

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
