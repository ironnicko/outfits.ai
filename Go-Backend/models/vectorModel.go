package models

import (
	"gorm.io/gorm"
)

type Vector struct {
	gorm.Model
	UserID     uint
	User       User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	ClothingID uint      `json:"clothing_id"`
	Clothing   Clothing  `gorm:"foreignKey:ClothingID;constraint:OnDelete:CASCADE;"`
	Embedding  []float64 `gorm:"type:vector(384);not null"`
	Text       string
}
