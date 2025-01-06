package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Outfit struct {
	gorm.Model
	Occasion     string    `gorm:"size:255" json:"occasion" validate:"min=3,max=50"`
	Top          *uint     `json:"top"`
	OutfitTop    *Clothing `gorm:"foreignKey:Top;constraint:OnDelete:CASCADE;"`
	Bottom       *uint     `json:"bottom"`
	OutfitBottom *Clothing `gorm:"foreignKey:Bottom;constraint:OnDelete:CASCADE;"`
	Shoe         *uint     `json:"shoe"`
	OutfitShoe   *Clothing `gorm:"foreignKey:Shoe;constraint:OnDelete:CASCADE;"`
	Hat          *uint     `json:"hat"`
	OutfitHat    *Clothing `gorm:"foreignKey:Hat;constraint:OnDelete:CASCADE;"`
	UserID       uuid.UUID `json:"userID" gorm:"constraint:OnDelete:CASCADE;"`
}

func (u *Outfit) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
