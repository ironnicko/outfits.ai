package models

import (
	"gorm.io/gorm"
)

type UserToken struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`
	Token  string
}
