package controllers

import (
	configs "outfits/config"
	"outfits/models"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/auth-go"
	"github.com/supabase-community/auth-go/types"
)

func CreateUser(c *fiber.Ctx) error {
	db := configs.DB.Db
	user := models.User{}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	validate := validator.New()

	if err := validate.Struct(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	details := types.SignupRequest{
		Email:    user.Email,
		Password: user.Password,
	}
	userAuth, err := configs.SupabaseClient.Signup(details)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	user.ID = userAuth.ID
	user.Email = ""
	user.Password = ""
	result := db.Create(&user)

	if result.Error != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": false,
			"result": result.Error,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  true,
		"token":   userAuth.AccessToken,
		"message": "User Created",
	})

}

func LoginUser(c *fiber.Ctx) error {
	user := models.User{}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	userAuth, err := configs.SupabaseClient.SignInWithEmailPassword(user.Email, user.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	user.ID = userAuth.User.ID
	return c.JSON(fiber.Map{
		"status": true,
		"token":  userAuth.AccessToken,
		"userId": user.ID,
	})
}

func LogoutUser(c *fiber.Ctx) error {
	userClient := c.Locals("client").(auth.Client)
	userClient.Logout()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": true,
		"result": "User Logout Successful",
	})
}

// // To extract user information from the token

func UserInfo(c *fiber.Ctx) error {
	userObj := c.Locals("user").(types.UserResponse)
	db := configs.DB.Db
	user := models.User{}
	db.Where("id = ?", userObj.ID.String()).Find(&user)
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "User Information",
		"result": fiber.Map{
			"id":       userObj.ID.String(),
			"username": user.Username,
		},
	})
}
