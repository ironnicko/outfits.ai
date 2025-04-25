package main

import (
	"fmt"
	"log"
	config "outfits/config"

	"outfits/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	config.ReadConfigs()
	fmt.Println(config.PRODUCTION)
	if config.PRODUCTION != "PROD" {
		err := godotenv.Load(".env.local")
		config.ReadConfigs()
		if err != nil {
			log.Fatalf("Error loading .env file")
		}
		fmt.Println(config.SEGMENT_URL)
	}

	config.ConnectDb()
	config.S3Init()
	app := fiber.New()

	// When going PROD don't forget to change Origins problem

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			return true
		},
		AllowCredentials: true,
	}))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello Fiber")
	})
	api := app.Group("/api/v1")
	routes.SetUpUserRoutes(api)
	routes.SetUpClothingRoutes(api)
	routes.SetUpOutfitRoutes(api)

	app.Listen(":" + config.PORT)

}
