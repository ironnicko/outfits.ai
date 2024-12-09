resource "aws_s3_bucket" "outfits-bucket" {
  bucket = "outfits.ai-bucket"
  tags = {
    Name = "outfits.ai"
  }
}