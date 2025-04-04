package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	config "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/auth-go/types"
)

func CreateOutfit(c *fiber.Ctx) error {
	outfit := models.Outfit{}
	user := c.Locals("user").(types.UserResponse)
	db := config.Db
	if err := c.BodyParser(&outfit); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	outfit.UserID = user.ID

	if err := db.Create(&outfit); err.Error != nil {
		return ErrorRollBack(c, nil, 0, err.Error.Error())
	}
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "Outfit Created!",
	})
}

func ColorTherapyController(c *fiber.Ctx) error {
	url := config.SEGMENT_URL + ":8001/outfit/colortherapy"
	db := config.Db
	user := c.Locals("user").(types.UserResponse)

	Data := []models.Clothing{}

	if err := db.Preload("Tags").
		Where("user_id = ?", user.ID.String()).Find(&Data).Error; err != nil {
		return c.Status(500).SendString(err.Error())
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).SendString("Missing file in request")
	}

	src, err := file.Open()
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer src.Close()

	fileWriter, err := writer.CreateFormFile("file", file.Filename)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	if _, err = io.Copy(fileWriter, src); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	jsonData, err := json.Marshal(Data)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	if err := writer.WriteField("Data", string(jsonData)); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	writer.Close()

	responseBody, err := SendRequest(url, body, writer)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(fiber.StatusAccepted).Send(responseBody)
}
func OutfitCheck(c *fiber.Ctx) error {
	url := config.SEGMENT_URL + ":8001/outfit/outfitcheck"
	_, req := ForwardRequest(c, url)
	return req
}

func GetOutfits(c *fiber.Ctx) error {
	var outfits []models.Outfit
	db := config.Db
	user := c.Locals("user").(types.UserResponse)

	if err := db.Preload("OutfitTop").Preload("OutfitBottom").Preload("OutfitShoe").Preload("OutfitHat").
		Where("user_id = ?", user.ID.String()).Find(&outfits).Error; err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(outfits)
}

func DeleteOutfit(c *fiber.Ctx) error {
	outfit := models.Outfit{}
	db := config.Db
	outfitID := c.Params("outfit_id")

	if err := db.First(&outfit, outfitID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Clothing item not found",
		})
	}

	if err := db.Delete(&outfit).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete clothing item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Clothing item deleted successfully",
	})
}
