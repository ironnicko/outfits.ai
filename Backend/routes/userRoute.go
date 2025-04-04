package routes

import (
	"outfits/controllers"
	"outfits/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetUpUserRoutes(group fiber.Router) {
	userRoute := group.Group("/user")

	userRoute.Post("/", controllers.CreateUser)
	userRoute.Post("/login", controllers.LoginUser)
	userRoute.Post("/logout", middleware.JWTProtected(), controllers.LogoutUser)
	userRoute.Get("/", middleware.JWTProtected(), controllers.UserInfo)
	userRoute.Post("/onboard", middleware.JWTProtected(), controllers.OnBoardingCompleted)
	userRoute.Post("/onboardimgs", middleware.JWTProtected(), controllers.OnBoardingImages)
}
