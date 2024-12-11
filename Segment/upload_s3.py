from dotenv import load_dotenv
import boto3
import os

load_dotenv()

aws_access_key = os.getenv("ACCESS_KEY")
aws_secret_key = os.getenv("SECRET_KEY")
aws_session_token = os.getenv("SESSION")


def upload_s3(in_mem_file, metadata):
    file_name = metadata['cid'] + ".png"
    bucket_name = os.getenv("BUCKET_NAME")
    bucket = boto3.client('s3', region_name="us-east-1", aws_access_key_id=aws_access_key,
                          aws_secret_access_key=aws_secret_key, aws_session_token=aws_session_token)

    bucket.upload_fileobj(in_mem_file, bucket_name,
                          f"clothing/{metadata['uid']}/{metadata['type']}/{file_name}", ExtraArgs={"ACL": "public-read"})
