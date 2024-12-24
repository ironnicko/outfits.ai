import io

import requests
from upload_s3 import upload_s3
import dotenv
from os import getenv
from PIL import Image

dotenv.load_dotenv()


def send_post_request(url):
    try:

        headers = {
            "accept": "application/json"
        }
        data = {
            'model': getenv("MODEL"),
            'a': 'false',
            'af': '240',
            'ab': '10',
            'ae': '10',
            'om': 'false',
            'ppm': 'false'
        }

        print("Sending Request")
        response = requests.get(url, headers=headers, data=data)

        if response.status_code == 200:
            print("Sent!")
            return response.content
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            raise Exception("Failed to send POST request")
    except Exception as e:
        print(f"Error in send_post_request: {e}")
        return b""


def remove_bg(file_bytes, metadata):
    upload_s3(file_bytes, metadata)
    file_name = metadata['cid'] + ".png"
    s3_url = "https://s3.us-east-1.amazonaws.com/outfits.ai-bucket/" + \
        f"clothing/{metadata['uid']}/{metadata['type']}/{file_name}"
    try:
        url = "http://" + getenv("REM_HOST") + f":7001/api/remove?url={s3_url}"

        img = send_post_request(url)

        if img:
            upload_s3(img, metadata)
            print("Upload Success!")
            return img
        else:
            raise Exception("Image processing failed")
    except Exception as e:
        print(f"Error in remove_bg: {e}")
        return b""
