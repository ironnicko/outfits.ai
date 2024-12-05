from dotenv import load_dotenv
import boto3
import os
load_dotenv()


def upload_s3(in_mem_file, metadata):

    file_name = metadata['cid'] + ".png"
    bucket_name = os.getenv("BUCKET_NAME")
    bucket = boto3.client('s3')

    bucket.upload_fileobj(in_mem_file, bucket_name,
                          f"clothing/{metadata['uid']}/{file_name}", ExtraArgs={"ACL": "public-read"})
