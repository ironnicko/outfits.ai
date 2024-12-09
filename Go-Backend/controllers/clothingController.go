package controllers

import (
	"fmt"
	"os"
	configs "outfits/config"
	"outfits/models"
	"strconv"
	"strings"

	"bytes"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

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

	// Close the writer to finalize the multipart form
	writer.Close()

	// Send the POST request to the FastAPI server
	url := os.Getenv("PUBLIC_IP") + ":8001/upload"
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

	// Return the FastAPI server's response to the client
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		db.Delete(&models.Clothing{}, clothing.ID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read response from FastAPI server",
		})
	}

	bucket := strings.Join([]string{os.Getenv("BUCKET_PREFIX"), strUID, strCID + ".png"}, "/")
	clothing.ClothingURL = bucket
	db.Save(&clothing)

	return c.Status(resp.StatusCode).Send(respBody)

}

func CreateResponseClothing(clothing models.Clothing) models.Clothing {
	return models.Clothing{

		ClothingColor: clothing.ClothingColor,
		ClothingStyle: clothing.ClothingStyle,
		ClothingType:  clothing.ClothingType,
		UserID:        clothing.UserID}
}

func GetClothings(c *fiber.Ctx) error {
	db := configs.DB.Db
	user := c.Locals("user").(models.User)
	clothings := []models.Clothing{}
	db.Where("user_id = ?", user.ID).Find(&clothings)
	responseClothings := []models.Clothing{}
	for _, clothing := range clothings {
		responseClothing := CreateResponseClothing(clothing)
		responseClothings = append(responseClothings, responseClothing)
	}

	return c.JSON(responseClothings)
}
