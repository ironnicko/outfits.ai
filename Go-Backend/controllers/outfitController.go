package controllers

import (
	configs "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/auth-go/types"
)

func CreateOutfit(c *fiber.Ctx) error {
	outfit := models.Outfit{}
	user := c.Locals("user").(types.UserResponse)
	db := configs.DB.Db
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

func GetOutfits(c *fiber.Ctx) error {
	var outfits []models.Outfit
	db := configs.DB.Db
	user := c.Locals("user").(types.UserResponse)

	if err := db.Preload("OutfitTop").Preload("OutfitBottom").Preload("OutfitShoe").Preload("OutfitHat").
		Where("user_id = ?", user.ID.String()).Find(&outfits).Error; err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(outfits)
}
