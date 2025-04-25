package configs

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/supabase-community/auth-go"
	"gorm.io/gorm"
)

var SupabaseClient auth.Client
var Db *gorm.DB
var S3Client *s3.S3
var AwsSEss *session.Session
var BUCKETNAME, PRODUCTION, PORT, DB_USERNAME, SEGMENT_URL, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, SUPABASE_URL, SUPABASE_ANNON string

func S3Init() error {

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-2"),
	})
	if err != nil {
		return fmt.Errorf("failed to create session: %v", err)
	}

	S3Client = s3.New(sess)
	AwsSEss = sess
	return nil
}

func ReadConfigs() {
	BUCKETNAME = os.Getenv("BUCKET_NAME")
	PRODUCTION = os.Getenv("PRODUCTION")
	PORT = os.Getenv("PORT")
	DB_USERNAME = os.Getenv("DB_USERNAME")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
	DB_PORT = os.Getenv("DB_PORT")
	DB_NAME = os.Getenv("DB_NAME")
	DB_HOST = os.Getenv("DB_HOST")
	SUPABASE_URL = os.Getenv("URL")
	SUPABASE_ANNON = os.Getenv("ANON")
	SEGMENT_URL = os.Getenv("SEGMENT_URL")

}
