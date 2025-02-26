package controllers

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/auth-go/types"
)

func MixAndMatchController(c *fiber.Ctx) error {

	user := c.Locals("user").(types.UserResponse)
	db := configs.DB.Db

	url := os.Getenv("SEGMENT_URL") + ":8001/outfit/mixandmatch"
	respBody, _ := ForwardRequest(c, url)

	var fastAPIResponse struct {
		Tags      []string `json:"Tags"`
		Status    string   `json:"status"`
		Embedding string   `json:"embedding"`
		Type      string   `json:"clothingType"`
		Color     string   `json:"color"`
	}
	if err := json.Unmarshal(respBody, &fastAPIResponse); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	types := make([]string, 0)
	for _, type_single := range []string{"top", "bottom", "hat", "shoe"} {
		if type_single != fastAPIResponse.Type {
			types = append(types, type_single)
		}
	}
	simliarClothes, err := GetSimilarClothings(db, fastAPIResponse.Embedding, types, user.ID)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	clothes, err := GetClothingsByIDs(db, simliarClothes)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	clothing := models.Clothing{}
	for _, tag := range fastAPIResponse.Tags {
		clothing.Tags = append(clothing.Tags, models.Tags{TagName: tag})
	}
	clothing.ClothingType = fastAPIResponse.Type
	clothing.ClothingColor = fastAPIResponse.Color

	return GetDescription(c, clothes, clothing)
}

func GetDescription(c *fiber.Ctx, clothes []models.Clothing, clothing models.Clothing) error {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	clothesJSON, err := json.Marshal(clothes)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	clothingJSON, err := json.Marshal(clothing)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.WriteField("clothes", string(clothesJSON)); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	if err := writer.WriteField("clothing", string(clothingJSON)); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	if err := writer.Close(); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	url := os.Getenv("SEGMENT_URL") + ":8001/outfit/get-opinion"

	responses, err := SendRequest(url, body, writer)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	var response struct {
		Explanation string            `json:"explanation"`
		Rating      int               `json:"rating"`
		Clothes     []models.Clothing `json:"clothes"`
	}
	response.Clothes = clothes
	if err := json.Unmarshal(responses, &response); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
