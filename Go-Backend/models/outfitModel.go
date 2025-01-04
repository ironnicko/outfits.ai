package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Outfit struct {
	gorm.Model
	Outfitoccasion string    `gorm:"size:255;uniqueIndex" json:"outfitname" validate:"min=3,max=50"`
	Outfittop      string    `json:"top"`
	Top            Clothing  `gorm:"foreignKey:Outfittop;constraint:OnDelete:CASCADE;"`
	Outfitbottom   string    `json:"bottom"`
	Bottom         Clothing  `gorm:"foreignKey:Outfitbottom;constraint:OnDelete:CASCADE;"`
	Outfitshoe     string    `json:"shoe"`
	Shoe           Clothing  `gorm:"foreignKey:Outfitshoe;constraint:OnDelete:CASCADE;"`
	Outfithat      string    `json:"hat"`
	Hat            Clothing  `gorm:"foreignKey:Outfithat;constraint:OnDelete:CASCADE;"`
	UserID         uuid.UUID `json:"userID" gorm:"constraint:OnDelete:CASCADE;"`
	User           User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
}

func (u *Outfit) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
