package configs

import (
	"log"
	"os"
	"outfits/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Declare a structure it will be a pointer which will hold the database connection instance
type Dbinstance struct {
	Db *gorm.DB
}

// Global Variable It will hold database instance throughout the application
var DB Dbinstance

func ConnectDb() {
	user := os.Getenv("DB_USERNAME")
	passw := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_NAME")
	host := os.Getenv("DB_HOST")

	dsn := "postgresql://" + user + ":" + passw + "@" + host + ":" + port + "/" + dbname

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	log.Println("DATABASE CONNECTED")
	db.Logger = logger.Default.LogMode(logger.Info)
	log.Println("running migrations")
	// Auto Migration Of Models
	err = db.AutoMigrate(&models.Tags{}, &models.Clothing{}, &models.User{}, &models.UserToken{}, &models.Outfit{})
	DB = Dbinstance{
		Db: db,
	}

	if err != nil {
		log.Printf("Failed to automigrate")
	}

}
