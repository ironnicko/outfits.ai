package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"os"

	"github.com/gofiber/fiber/v2"
)

func OutfitCheck(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	file, err := fileHeader.Open()
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	defer file.Close()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	// Copy the file buffer to the multipart form part
	io.Copy(part, file)
	writer.Close()
	url := os.Getenv("SEGMENT_URL") + ":8001/outfit/outfitcheck"
	respBody, err := SendRequest(url, body, writer)

	if err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}
	response := make(map[string]interface{})
	if err := json.Unmarshal(respBody, &response); err != nil {
		return ErrorRollBack(c, nil, 0, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
