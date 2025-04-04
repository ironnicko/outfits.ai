package configs

import (
	"log"
	"os"
	"outfits/models"

	"github.com/supabase-community/auth-go"
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
var SupabaseClient auth.Client

func CreateUsersTable(db *gorm.DB) error {
	return db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			email VARCHAR(255),
			password VARCHAR(255),
			username VARCHAR(255),
			id UUID  PRIMARY KEY,
			FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
		);
	`).Error
}

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

	if err := CreateUsersTable(db); err != nil {
		log.Fatalf("failed to create users table: %v", err)
	}

	// Auto Migration Of Models
	db.Exec(`ALTER TABLE vectors DROP CONSTRAINT IF EXISTS fk_vectors_user`)
	db.Exec(`ALTER TABLE clothings DROP CONSTRAINT IF EXISTS fk_clothings_user`)
	err = db.AutoMigrate(&models.Vector{}, &models.Tags{}, &models.Clothing{}, &models.User{}, &models.Outfit{})

	DB = Dbinstance{
		Db: db,
	}
	SupabaseClient = auth.New(os.Getenv("URL"), os.Getenv("ANON"))
	if err != nil {
		log.Printf("Failed to automigrate")
	}

}
