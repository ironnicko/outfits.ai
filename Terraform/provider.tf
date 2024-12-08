terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.76.0"
    }
  }
}


provider "aws" {
  region                   = "us-east-1"
  shared_config_files      = ["/Users/nikhilivannan/.aws/config"]
  shared_credentials_files = ["/Users/nikhilivannan/.aws/credentials"]

}