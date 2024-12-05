package models

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"size:255;uniqueIndex" json:"username" validate:"required,min=3,max=50"`
	Email    string `gorm:"size:255;uniqueIndex" json:"email" validate:"required,email"`
	Password string `gorm:"size:255" json:"password" validate:"required,min=7"`
}

func (u *User) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
