package controllers

import (
	"fmt"
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/auth-go"
	"github.com/supabase-community/auth-go/types"
)

func CreateUser(c *fiber.Ctx) error {
	db := configs.Db
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

	userAuth, err := configs.SupabaseClient.SignInWithEmailPassword(c.FormValue("email"), c.FormValue("password"))
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

func OnBoardingCompleted(c *fiber.Ctx) error {
	db := configs.Db
	userObj := c.Locals("user").(types.UserResponse)

	body := models.User{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": err.Error(),
		})
	}

	body.IsOnBoardingCompleted = true

	fmt.Println(body)

	db.Model(&models.User{}).Where("id = ?", userObj.ID).Updates(body)
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "User Information",
		"result":  "Success",
	})
}

func OnBoardingImages(c *fiber.Ctx) error {

	db := configs.Db
	userObj := c.Locals("user").(types.UserResponse)
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": false,
			"result": "Failed to retrieve multipart form",
		})
	}

	files := form.File["photos"]
	var uploadedFileURLs []string

	for _, file := range files {
		fileReader, err := file.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status": false,
				"result": "Failed to open file",
			})
		}
		defer fileReader.Close()

		objectKey := "body/" + userObj.ID.String() + "/" + file.Filename
		fileURL, err := UploadObject(os.Getenv("BUCKET_NAME"), objectKey, fileReader)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status": false,
				"result": "Failed to upload file to S3",
			})
		}

		uploadedFileURLs = append(uploadedFileURLs, fileURL)
	}

	body := models.User{

		BodyImage: uploadedFileURLs[0],
	}

	db.Model(&models.User{}).Where("id = ?", userObj.ID).Updates(body)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "User  Information",
		"result":  "Success",
	})
}

// // To extract user information from the token

func UserInfo(c *fiber.Ctx) error {
	userObj := c.Locals("user").(types.UserResponse)

	db := configs.Db
	user := make(map[string]interface{})
	db.Model(&models.User{}).Where("id = ?", userObj.ID.String()).Find(&user)
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status":  true,
		"message": "User Information",
		"result":  user,
	})
}
