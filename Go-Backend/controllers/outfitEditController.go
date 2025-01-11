package controllers

import (
	configs "outfits/config"
	"outfits/models"

	"github.com/gofiber/fiber/v2"
)

func DeleteOutfit(c *fiber.Ctx) error {
	outfit := models.Outfit{}
	db := configs.DB.Db
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
