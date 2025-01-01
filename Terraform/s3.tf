resource "aws_s3_bucket" "outfits-ai" {
  bucket = var.bucket_name
}


resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}


resource "aws_s3_bucket_ownership_controls" "outfits-ai" {
  bucket = aws_s3_bucket.outfits-ai.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_public_access_block" "outfits-ai" {
  bucket = aws_s3_bucket.outfits-ai.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "outfits-ai" {
  depends_on = [
    aws_s3_bucket_ownership_controls.outfits-ai,
    aws_s3_bucket_public_access_block.outfits-ai,
  ]

  bucket = aws_s3_bucket.outfits-ai.id
  acl    = "public-read"
}