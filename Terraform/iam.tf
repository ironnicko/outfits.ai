# iam.tf (create this file)
resource "aws_iam_role" "ec2_role" {
  name = "ec2-outfits-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-outfits-profile"
  role = aws_iam_role.ec2_role.name
}



resource "aws_iam_policy" "minimal_ec2_s3_access" {
  name        = "MinimalEC2S3Access"
  path        = "/"
  description = "Minimal permissions for EC2 and S3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:Describe*",
          "ec2:RunInstances",
          "ec2:TerminateInstances",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = "*"
      }
    ]
  })
}


# Optional: Additional EC2 describe permissions
resource "aws_iam_role_policy" "ec2_describe" {
  name = "ec2-describe-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:Describe*"
        ]
        Resource = "*"
      }
    ]
  })
}