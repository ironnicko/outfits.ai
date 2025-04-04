package models

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID                    uuid.UUID      `gorm:"type:uuid;uniqueIndex;primaryKey;default:uuid_generate_v4()" json:"id"`
	Username              string         `gorm:"size:255;uniqueIndex" json:"username"`
	IsOnBoardingCompleted bool           `gorm:"type:bool;default:false" json:"is_onboarding_completed"`
	MarketOnBoarding      bool           `gorm:"type:bool;default:false" json:"market_on_boarding"`
	Gender                string         `gorm:"size:7" json:"gender"`
	BodyShape             string         `gorm:"size:255" json:"body_shape"`
	HairColor             string         `gorm:"size:255" json:"hair_color"`
	EyeColor              string         `gorm:"size:255" json:"eye_color"`
	SeasonalColorType     string         `gorm:"size:255" json:"seasonal_color_type"`
	DressingChallenges    pq.StringArray `gorm:"type:text[];" json:"dressing_challenges"`
	Colors                pq.StringArray `gorm:"type:text[];" json:"colors"`
	Styles                pq.StringArray `gorm:"type:text[];" json:"styles"`
	SkinTone              string         `gorm:"size:255" json:"skin_tone"`
	UnderTone             string         `gorm:"size:255" json:"under_tone"`
	BodyImages            pq.StringArray `gorm:"type:text[];" json:"photos"`
	DOB                   string         `gorm:"type:DATE" json:"dob"`
}

func (u *User) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
