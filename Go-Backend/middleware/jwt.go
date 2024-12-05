package middleware

import (
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/dgrijalva/jwt-go"

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

		tokenString := authHeader[len("Bearer "):]

		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "Empty Token",
			})
		}

		var userToken models.UserToken

		if err := configs.DB.Db.Where("token = ?", tokenString).First(&userToken).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "Invalid Token",
			})
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status": false,
				"result": "Invalid Token",
			})
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID := uint(claims["user_id"].(float64))
			var user models.User
			if err := configs.DB.Db.Where("id = ?", userID).First(&user).Error; err != nil {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"status": false,
					"result": "Invalid Token",
				})
			}
			// storing user information in context
			c.Locals("user", user)
			return c.Next()
		}

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": false,
			"result": "Invalid Token",
		})

	}
}
