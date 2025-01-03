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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "File issue!"})
	}
	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "File issue!"})
	}
	defer file.Close()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "File issue!"})
	}
	// Copy the file buffer to the multipart form part
	io.Copy(part, file)
	writer.Close()
	url := os.Getenv("SEGMENT_URL") + ":8001/outfitcheck"
	respBody, err := SendRequest(url, body, writer)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	var fastAPIResponse struct {
		Score        int    `json:"Score"`
		DoingWell    string `json:"DoingWell"`
		NotDoingWell string `json:"NotDoingWell"`
		Improvements string `json:"Improvements"`
	}
	if err := json.Unmarshal(respBody, &fastAPIResponse); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "JSON parsing Error!"})
	}

	return c.Status(fiber.StatusOK).JSON(fastAPIResponse)
}
