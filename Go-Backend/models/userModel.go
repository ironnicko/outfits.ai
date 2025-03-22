package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID                    uuid.UUID      `gorm:"type:uuid;uniqueIndex;primaryKey;default:uuid_generate_v4()" json:"id"`
	Username              string         `gorm:"size:255;uniqueIndex" json:"username"`
	IsOnBoardingCompleted bool           `gorm:"type:bool;default:false" json:"isOnboardingCompleted"`
	MarketOnBoarding      bool           `gorm:"type:bool;default:false" json:"marketOnBoarding"`
	Gender                string         `gorm:"size:7" json:"gender"`
	BodyShape             string         `gorm:"size:255" json:"bodyShape"`
	HairColor             string         `gorm:"size:255" json:"hairColor"`
	EyeColor              string         `gorm:"size:255" json:"eyeColor"`
	SeasonalColorType     string         `gorm:"size:255" json:"seasonalColorType"`
	DressingChallenges    pq.StringArray `gorm:"type:text[];" json:"dressingChallenges"`
	Colors                pq.StringArray `gorm:"type:text[];" json:"colors"`
	Styles                pq.StringArray `gorm:"type:text[];" json:"styles"`
	SkinTone              string         `gorm:"size:255" json:"skinTone"`
	UnderTone             string         `gorm:"size:255" json:"underTone"`
	BodyImages            pq.StringArray `gorm:"type:text[];" json:"bodyImages"`
	DOB                   time.Time      `gorm:"type:DATE" json:"dob"`
}

func (u *User) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}
