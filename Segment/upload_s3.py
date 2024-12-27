from dotenv import load_dotenv
import boto3
import os
from io import BytesIO


def upload_s3(in_mem_file, metadata):
    load_dotenv()
    aws_access_key = os.getenv("ACCESS_KEY")
    aws_secret_key = os.getenv("SECRET_KEY")
    aws_session_token = os.getenv("SESSION")
    in_mem_file = BytesIO(in_mem_file)
    print("Uploading to S3")
    file_name = metadata['cid'] + ".png"
    bucket_name = os.getenv("BUCKET_NAME")
    bucket = boto3.client('s3', region_name="us-east-1", aws_access_key_id=aws_access_key,
                          aws_secret_access_key=aws_secret_key, aws_session_token=aws_session_token)
    suffix = f"clothing/{metadata['uid']}/{metadata['type']}/{file_name}"
    bucket.upload_fileobj(in_mem_file, bucket_name,
                          suffix, ExtraArgs={"ACL": "public-read"})
    return f"https://s3.us-east-1.amazonaws.com/{bucket_name}/" + suffix
