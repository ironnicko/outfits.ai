from dotenv import load_dotenv
import aioboto3
import os
from io import BytesIO


load_dotenv()


async def upload_s3(in_mem_file, metadata):
    print("Uploading To S3")
    in_mem_file = BytesIO(in_mem_file)

    file_name = f"{metadata['cid']}.png"
    bucket_name = os.getenv("BUCKET_NAME")
    session = aioboto3.Session()
    async with session.client('s3', region_name="ap-south-2",) as bucket:
        suffix = f"clothing/{metadata['uid']}/{metadata['type']}/{file_name}"

        await bucket.upload_fileobj(in_mem_file, bucket_name,
                                    suffix, ExtraArgs={"ACL": "public-read"})
