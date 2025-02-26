package routes

import (
	"outfits/controllers"
	"outfits/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetUpClothingRoutes(group fiber.Router) {
	clothingRoute := group.Group("/clothing")

	clothingRoute.Get("/", middleware.JWTProtected(), controllers.GetClothings)
	clothingRoute.Get("/:clothing_id", middleware.JWTProtected(), controllers.GetClothing)
	clothingRoute.Delete("/:clothing_id", middleware.JWTProtected(), controllers.DeleteClothing)
	clothingRoute.Post("/", middleware.JWTProtected(), controllers.CreateClothing)
	clothingRoute.Post("/outfitcheck", middleware.JWTProtected(), controllers.OutfitCheck)
	clothingRoute.Post("/color", middleware.JWTProtected(), controllers.GetColor)
	clothingRoute.Post("/generate-outfits", middleware.JWTProtected(), controllers.GenerateOutfit)

}
