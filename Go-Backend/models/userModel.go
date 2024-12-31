package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:uuid;primaryKey;size:255;uniqueIndex;" json:"id"`
	Username string    `gorm:"size:255;uniqueIndex" json:"username"`
	Email    string    `gorm:"size:255;" json:"email"`
	Password string    `gorm:"size:255;" json:"password"`
}

func (u *User) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
