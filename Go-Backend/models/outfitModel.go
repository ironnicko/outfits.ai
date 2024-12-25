package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Outfit struct {
	gorm.Model

	Outfitname   string    `gorm:"size:255;uniqueIndex" json:"outfitname" validate:"min=3,max=50"`
	Outfitup     string    `json:"up" validate:"required"`
	Up           Clothing  `gorm:"foreignKey:Outfitup;constraint:OnDelete:CASCADE;"`
	Outfitbottom string    `json:"bottom" validate:"required"`
	Bottom       Clothing  `gorm:"foreignKey:Outfitbottom;constraint:OnDelete:CASCADE;"`
	Outfitshoes  *string   `json:"shoes"`
	Shoes        *Clothing `gorm:"foreignKey:Outfitshoes;constraint:OnDelete:CASCADE;"`
	Outfithat    *string   `json:"hat"`
	Hat          *Clothing `gorm:"foreignKey:Outfithat;constraint:OnDelete:CASCADE;"`
	Outfitdress  *string   `json:"dress"`
	Dress        *Clothing `gorm:"foreignKey:Outfitdress;constraint:OnDelete:CASCADE;"`
	UserID       uint      `json:"userID" gorm:"constraint:OnDelete:CASCADE;"`
	User         User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
}

func (u *Outfit) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
