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
	user := " user=" + os.Getenv("DB_USERNAME")
	port := " port=" + os.Getenv("DB_PORT")
	dbname := " dbname=" + os.Getenv("DB_NAME")
	passw := " password=" + os.Getenv("DB_PASSWORD")
	// host := " host=localhost"
	host := " host=" + os.Getenv("DB_HOST")
	timezone := " TimeZone=" + os.Getenv("TIMEZONE")
	dsn := host + passw + dbname + port + user + timezone + " sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	log.Println("DATABASE CONNECTED")
	db.Logger = logger.Default.LogMode(logger.Info)
	// log.Println("running migrations")
	// Auto Migration Of Models
	db.AutoMigrate(&models.Clothing{}, &models.User{}, &models.UserToken{}, &models.Outfit{})
	DB = Dbinstance{
		Db: db,
	}
}
