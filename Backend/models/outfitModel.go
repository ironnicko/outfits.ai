package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Outfit struct {
	gorm.Model
	Occasion     string    `gorm:"size:255" json:"occasion" validate:"min=3,max=50"`
	Top          *int64    `json:"top"`
	OutfitTop    *Clothing `gorm:"foreignKey:Top;constraint:OnDelete:CASCADE;"`
	Bottom       *int64    `json:"bottom"`
	OutfitBottom *Clothing `gorm:"foreignKey:Bottom;constraint:OnDelete:CASCADE;"`
	Shoe         *int64    `json:"shoe"`
	TryOnImage  string    `json:"try_on_image"`
	OutfitShoe   *Clothing `gorm:"foreignKey:Shoe;constraint:OnDelete:CASCADE;"`
	Hat          *int64    `json:"hat"`
	OutfitHat    *Clothing `gorm:"foreignKey:Hat;constraint:OnDelete:CASCADE;"`
	Description  *string   `json:"description"`
	UserID       uuid.UUID `json:"userID" gorm:"constraint:OnDelete:CASCADE;"`
}

func (u *Outfit) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
