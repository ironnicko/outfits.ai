package controllers

import (
	"fmt"
	"os"
	configs "outfits/config"
	"outfits/models"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gofiber/fiber/v2"
)

func DeleteClothing(c *fiber.Ctx) error {
	db := configs.DB.Db

	clothingID := c.Params("clothing_id")

	fmt.Println(clothingID)

	clothing := models.Clothing{}
	if err := db.First(&clothing, clothingID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Clothing item not found",
		})
	}
	objectKey := "clothing/" + clothing.UserID.String() + "/" + clothing.ClothingType + "/" + clothingID + ".png"
	if err := deleteS3Object(os.Getenv("BUCKET_NAME"), objectKey); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete clothing item",
		})
	}

	if err := db.Delete(&clothing).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete clothing item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Clothing item deleted successfully",
	})
}

func deleteS3Object(bucketName, objectKey string) error {

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-2"),
	})
	if err != nil {
		return fmt.Errorf("failed to create session: %v", err)
	}

	svc := s3.New(sess)

	_, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})
	if err != nil {
		return fmt.Errorf("failed to delete object: %v", err)
	}

	err = svc.WaitUntilObjectNotExists(&s3.HeadObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	})
	if err != nil {
		return fmt.Errorf("failed to wait for object deletion: %v", err)
	}

	fmt.Printf("Deleted %s from %s\n", objectKey, bucketName)
	return nil
}
