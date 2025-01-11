package routes

import (
	"outfits/controllers"
	"outfits/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetUpOutfitRoutes(group fiber.Router) {
	clothingRoute := group.Group("/outfit")

	// clothingRoute.Get("/:outfit_id", middleware.JWTProtected(), controllers.GetOutfit)
	clothingRoute.Delete("/:outfit_id", middleware.JWTProtected(), controllers.DeleteOutfit)
	clothingRoute.Get("/", middleware.JWTProtected(), controllers.GetOutfits)
	clothingRoute.Post("/", middleware.JWTProtected(), controllers.CreateOutfit)
	clothingRoute.Post("/outfitcheck", middleware.JWTProtected(), controllers.OutfitCheck)
	clothingRoute.Post("/generate-outfits", middleware.JWTProtected(), controllers.GenerateOutfit)
	clothingRoute.Post("/mixandmatch", middleware.JWTProtected(), controllers.MixAndMatchController)

}
