package models

import (
	"gorm.io/gorm"
)

type UserToken struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Token  string
}
