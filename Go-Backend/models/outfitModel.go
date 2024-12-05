package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Outfit struct {
	gorm.Model

	Outfitname   string    `gorm:"size:255;uniqueIndex" json:"outfitname" validate:"min=3,max=50"`
	Outfitup     string    `json:"up" validate:"required"`
	Up           Clothing  `gorm:"foreignKey : Outfitup"`
	Outfitbottom string    `json:"bottom" validate:"required"`
	Bottom       Clothing  `gorm:"foreignKey : Outfitbottom"`
	Outfitshoes  *string   `json:"shoes" `
	Shoes        *Clothing `gorm:"foreignKey : Outfitshoes"`
	Outfithat    *string   `json:"hat" `
	Hat          *Clothing `gorm:"foreignKey : Outfithat"`
	Outfitdress  *string   `json:"dress" `
	Dress        *Clothing `gorm:"foreignKey : Outfitdress"`
	UserID       uint      `json:"userID"`
	User         User      `gorm:"foreignKey:UserID"`
}

func (u *Outfit) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
