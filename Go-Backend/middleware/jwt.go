package middleware

import (
	"log"
	"strings"

	configs "outfits/config"

	"github.com/gofiber/fiber/v2"
)

func JWTProtected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "No Token Provided",
			})
		}

		parts := strings.Split(authHeader, " ")

		// Check if the token is in the expected format
		if len(parts) != 2 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token format",
			})
		}

		// Now safely access the parts
		scheme := parts[0]
		if scheme != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token scheme",
			})
		}

		// Access the token safely
		authToken := parts[1]
		if authToken == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "Empty Token",
			})
		}

		// Verify the token with Supabase
		userClient := configs.SupabaseClient.WithToken(authToken)
		user, err := userClient.GetUser()
		if err != nil {
			log.Printf("Token verification failed: %v", err)
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "Invalid Token",
			})
		}

		// Store user information in the context
		c.Locals("client", userClient)
		c.Locals("user", *user)
		// Proceed to the next handler
		return c.Next()
	}
}
