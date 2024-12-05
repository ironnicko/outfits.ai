package controllers

import (
	configs "outfits/config"
	"outfits/models"
	"outfits/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	user.Password = string(hashPassword)

	result := db.Create(&user)

	if result.Error != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": false,
			"result": result.Error,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  true,
		"message": "User Created",
	})

}

func LoginUser(c *fiber.Ctx) error {
	data := new(models.User)
	if err := c.BodyParser(data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	var user models.User
	result := configs.DB.Db.Where("email = ?", data.Email).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status": false,
				"error":  "Invalid email or password",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": false,
			"error":  result.Error.Error(),
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"error":  "Invalid email or password",
		})
	}

	// Check if a token already exists for the user
	var userToken models.UserToken
	if err := configs.DB.Db.Where("user_id = ?", user.ID).First(&userToken).Error; err == nil {
		return c.JSON(fiber.Map{
			"status": true,
			"token":  userToken.Token,
		})
	}

	// Generate a new token
	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	// Save the token to the database
	userToken = models.UserToken{
		UserID: user.ID,
		Token:  token,
	}
	if err := configs.DB.Db.Create(&userToken).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": false,
			"error":  err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": true,
		"token":  token,
		"userId": user.ID,
	})
}

func LogoutUser(c *fiber.Ctx) error {
	user := models.UserToken{}
	userId := c.Locals("user").(models.User)
	db := configs.DB.Db
	if err := db.Where("user_id =?", userId.ID).First(&user).Error; err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	} else {
		db.Delete(&user)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": true,
			"result": "User Logout Successful",
		})
	}
}

// To extract user information from the token

func UserInfo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "User Information",
		"result": fiber.Map{
			"id":       user.ID,
			"email":    user.Email,
			"username": user.Username,
		},
	})
}
