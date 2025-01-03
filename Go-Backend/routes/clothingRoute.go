package routes

import (
	"outfits/middleware"
	"outfits/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetUpClothingRoutes(group fiber.Router) {
	clothingRoute := group.Group("/clothing")

	clothingRoute.Get("/get-clothings", middleware.JWTProtected(), controllers.GetClothings)
	clothingRoute.Post("/add-clothing", middleware.JWTProtected(), controllers.CreateClothing)
	clothingRoute.Post("/outfitcheck", middleware.JWTProtected(), controllers.OutfitCheck)

}
