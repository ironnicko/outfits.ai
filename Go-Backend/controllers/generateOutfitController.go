package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/supabase-community/auth-go/types"
	"gorm.io/gorm"
)

var data struct {
	Occasion string   `json:"occasion"`
	Articles []string `json:"articles"`
}

var response struct {
	Embedding string `json:"embedding"`
}

func GetSimilarClothings(db *gorm.DB, embedding string, clothingTypes []string, userID uuid.UUID) ([]models.Clothing, error) {
	var clothings []models.Clothing

	// Create a subquery for cosine similarity
	subquery := db.Table("vectors").
		Select("clothing_id, 1 - (embedding <=> ?::vector) AS cos_sim", embedding).
		Joins("JOIN clothings ON clothings.id = vectors.clothing_id").
		Where("clothings.clothing_type IN (?)", clothingTypes).
		Where("clothings.user_id = ?", userID)

	// Execute the main query with the subquery
	err := db.Table("(?) AS sub", subquery).
		Select("clothing_id AS id").
		Where("cos_sim >= ?", 0.35).
		Order("cos_sim").
		Scan(&clothings).Error

	return clothings, err
}

func GenerateOutfit(c *fiber.Ctx) error {

	db := configs.DB.Db
	user := c.Locals("user").(types.UserResponse)
	respBody := data
	if err := c.BodyParser(&respBody); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	articles := respBody.Articles
	occasion := respBody.Occasion
	// Get embeddings for the tags

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	if err := writer.WriteField("occasion", occasion); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.Close(); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	url := os.Getenv("SEGMENT_URL") + ":8001/embedding"

	embedding, err := SendRequest(url, body, writer)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := json.Unmarshal(embedding, &response); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	replies, err := GetSimilarClothings(db, response.Embedding, articles, user.ID)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	var clothings []models.Clothing
	if len(replies) != 0 {
		db.Find(&clothings, replies)
	}

	fmt.Println(clothings, articles, occasion)
	return c.Status(fiber.StatusOK).JSON(clothings)
}
