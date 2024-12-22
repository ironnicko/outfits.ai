package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Tags struct {
	gorm.Model
	TagName    string   `json:"tag"`
	ClothingID uint     `json:"clothing_id"`
	Clothing   Clothing `gorm:"foreignKey:ClothingID"`
}

func (u *Tags) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
