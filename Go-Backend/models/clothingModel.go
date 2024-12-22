package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Clothing struct {
	gorm.Model
	ClothingColor string `gorm:"size:255" json:"color"`
	ClothingType  string `gorm:"size:255" json:"type" validate:"required,min=3,max=50"`
	UserID        uint   `json:"user_id"`
	User          User   `gorm:"foreignKey:UserID"`
	ClothingURL   string `gorm:"300" json:"url" `
}

func (u *Clothing) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
