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
	if c != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": errorMessage})
	}
	return nil
}
func CreateMultiPartFormBody(strUID uuid.UUID, strCID string, clothingType string, writer *multipart.Writer, fileBuffer *bytes.Buffer, fileHeader *multipart.FileHeader) error {
	// Create a new multipart request to send the file to the FastAPI server

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return err
	}

	// Copy the file buffer to the multipart form part
	io.Copy(part, fileBuffer)

	writer.WriteField("user_ID", strUID.String())

	writer.WriteField("clothing_ID", strCID)

	// Close the writer to finalize the multipart form
	writer.Close()
	return nil
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
		return ErrorRollBack(c, db, clothing.ID, err.Error())
	}

	clothing.UserID = user.ID

	result := db.Create(&clothing)
	if result.Error != nil {
		return ErrorRollBack(c, db, clothing.ID, result.Error.Error())
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		return ErrorRollBack(c, db, clothing.ID, err.Error())
	}

	go func() error { // Open the file in memory
		file, err := fileHeader.Open()
		if err != nil {
			db.Delete(&models.Clothing{}, clothing.ID)
			return ErrorRollBack(nil, db, clothing.ID, err.Error())
		}
		defer file.Close()

		// Create a buffer to hold the file contents
		var fileBuffer bytes.Buffer
		_, err = io.Copy(&fileBuffer, file)
		if err != nil {
			return ErrorRollBack(nil, db, clothing.ID, err.Error())
		}

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)

		strCID := strconv.FormatUint(uint64(clothing.ID), 10)

		err = CreateMultiPartFormBody(user.ID, strCID, clothing.ClothingType, writer, &fileBuffer, fileHeader)
		if err != nil {
			return ErrorRollBack(nil, db, clothing.ID, err.Error())
		}

		// Send the POST request to the FastAPI server
		url := os.Getenv("SEGMENT_URL") + ":8001/clothing/upload"
		respBody, err := SendRequest(url, body, writer)
		if err != nil {
			return ErrorRollBack(nil, db, clothing.ID, err.Error())
		}
		// Parse the JSON response
		var fastAPIResponse struct {
			Tags      []string `json:"Tags"`
			Status    string   `json:"status"`
			Embedding string   `json:"Embedding"`
			Type      string   `json:"clothingType"`
			Color     string   `json:"color"`
		}
		if err := json.Unmarshal(respBody, &fastAPIResponse); err != nil {
			return ErrorRollBack(nil, db, clothing.ID, err.Error())
		}

		// Save Tags to the database
		for _, tagName := range fastAPIResponse.Tags {
			tag := models.Tags{
				TagName:    tagName,
				ClothingID: clothing.ID,
			}
			if err := db.Create(&tag).Error; err != nil {
				return ErrorRollBack(nil, db, clothing.ID, err.Error())
			}
			clothing.Tags = append(clothing.Tags, tag)
		}

		// Save Vector to the Database
		query := "INSERT INTO vectors (user_id, clothing_id, embedding, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
		if db_error := db.Exec(query, user.ID, clothing.ID, fastAPIResponse.Embedding, time.Now(), time.Now()); db_error.Error != nil {
			return ErrorRollBack(nil, db, clothing.ID, db_error.Error.Error())
		}

		clothing.ClothingType = fastAPIResponse.Type
		clothing.ClothingColor = fastAPIResponse.Color
		bucket := strings.Join([]string{os.Getenv("BUCKET_PREFIX"), user.ID.String(), clothing.ClothingType, strCID + ".png"}, "/")
		clothing.ClothingURL = bucket

		if db_error := db.Save(&clothing); db_error.Error != nil {
			return ErrorRollBack(nil, db, clothing.ID, db_error.Error.Error())
		}
		return nil
	}()
	return c.Status(fiber.StatusAccepted).JSON(clothing)

}

func GetClothings(c *fiber.Ctx) error {
	db := configs.DB.Db
	user := c.Locals("user").(types.UserResponse)
	clothings := []models.Clothing{}
	db.Where("user_id = ?", user.ID.String()).Preload("Tags").Find(&clothings)

	return c.JSON(clothings)
}

func GetClothing(c *fiber.Ctx) error {
	db := configs.DB.Db
	clothing_id := c.Params("clothing_id")
	clothing := models.Clothing{}
	db.Where("id = ?", clothing_id).Preload("Tags").Find(&clothing)
	return c.JSON(clothing)

}
