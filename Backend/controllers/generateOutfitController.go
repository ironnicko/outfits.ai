package controllers

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/supabase-community/auth-go/types"
	"gorm.io/gorm"
)

var response struct {
	Embedding string `json:"embedding"`
}

func GetSimilarClothings(db *gorm.DB, embedding string, clothingTypes []string, userID uuid.UUID) ([]models.Clothing, error) {
	var clothings []models.Clothing

	subquery := db.Model(&models.Vector{}).
		Select("clothing_id, 1 - (embedding <=> ?::vector) AS cos_sim", embedding).
		Joins("JOIN clothings ON clothings.id = vectors.clothing_id").
		Where("clothings.clothing_type IN (?)", clothingTypes).
		Where("clothings.deleted_at IS NULL").
		Where("clothings.user_id = ?", userID)

	err := db.Table("(?) AS sub", subquery).
		Select("clothing_id AS id").
		Limit(10).
		Order("cos_sim DESC").
		Scan(&clothings).Error

	return clothings, err
}

func GenerateOutfit(c *fiber.Ctx) error {
	db := configs.DB.Db
	user := c.Locals("user").(types.UserResponse)

	var reqBody struct {
		Occasion         string            `json:"occasion"`
		Articles         []string          `json:"articles"`
		PairWithArticles []models.Clothing `json:"pairWithArticles"`
	}

	if err := c.BodyParser(&reqBody); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	articles := reqBody.Articles
	occasion := reqBody.Occasion
	pairWithArticles := reqBody.PairWithArticles

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	if err := writer.WriteField("occasion", occasion); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.Close(); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	url := os.Getenv("SEGMENT_URL") + ":8001/clothing/embedding"

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
	if len(replies) > 0 {
		clothings, err = GetClothingsByIDs(db, replies)
		if err != nil {
			return ErrorRollBack(c, nil, 0, err.Error())
		}
	}

	if err := writer.Close(); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	return GeneratePairings(c, clothings, pairWithArticles, occasion)
}

func GeneratePairings(c *fiber.Ctx, clothes []models.Clothing, pairWithArticles []models.Clothing, occasion string) error {
	body := &bytes.Buffer{}
	db := configs.DB.Db
	writer := multipart.NewWriter(body)

	clothesJSON, err := json.Marshal(clothes)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.WriteField("clothes", string(clothesJSON)); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	pairWithArticlesJSON, err := json.Marshal(pairWithArticles)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.WriteField("pairWithArticles", string(pairWithArticlesJSON)); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	if err := writer.WriteField("occasion", occasion); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.Close(); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	url := os.Getenv("SEGMENT_URL") + ":8001/outfit/generate-outfits"

	responses, err := SendRequest(url, body, writer)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	outfits := []models.Outfit{}

	if err := json.Unmarshal(responses, &outfits); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	returnOutfit := []models.Outfit{}
	for _, resp := range outfits {
		outfit := models.Outfit{}
		outfit.Description = resp.Description
		db.Preload("Tags").Where("id = ?", resp.Top).Find(&outfit.OutfitTop)
		db.Preload("Tags").Where("id = ?", resp.Bottom).Find(&outfit.OutfitBottom)
		db.Preload("Tags").Where("id = ?", resp.Hat).Find(&outfit.OutfitHat)
		db.Preload("Tags").Where("id = ?", resp.Shoe).Find(&outfit.OutfitShoe)
		returnOutfit = append(returnOutfit, outfit)
	}

	return c.Status(fiber.StatusOK).JSON(returnOutfit)
}
