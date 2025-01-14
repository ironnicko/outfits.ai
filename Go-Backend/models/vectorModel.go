package models

import (
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
