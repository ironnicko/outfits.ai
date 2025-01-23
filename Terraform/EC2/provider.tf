terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.76.0"
    }
  }
}


provider "aws" {
  region     = var.aws_region
  access_key = var.access_key
  secret_key = var.secret_key

}


resource "aws_iam_role_policy_attachment" "custom_policy_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.minimal_ec2_s3_access.arn
}