package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Vector struct {
	gorm.Model
	UserID     uuid.UUID
	ClothingID uint      `json:"clothing_id"`
	Clothing   Clothing  `gorm:"foreignKey:ClothingID;constraint:OnDelete:CASCADE;"`
	Embedding  []float64 `gorm:"type:vector(384);not null"`
}

func (u *Vector) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
