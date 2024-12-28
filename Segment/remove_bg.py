import io
import json
import random
import aiohttp
import dotenv
from os import getenv
from PIL import Image


dotenv.load_dotenv()


async def send_post_request(url, file_bytes, metadata):
    try:
        W, H = Image.open(io.BytesIO(file_bytes)).size
        headers = {
            "accept": "application/json",
        }

        extras = {
            "sam_prompt": [
                {
                    "type": "point",
                    "data": [(W >> 1) + random.randint(-5, 5), (H >> 1) + random.randint(5,5)],
                    "label": 1
                }
            ]
        }
        query_parameters = {
            "extras": json.dumps(extras)
        }

        form = aiohttp.FormData()
        form.add_field('file', file_bytes, filename=metadata["filename"],
                       content_type=metadata["filetype"])
        form.add_field('model', getenv("MODEL"))

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=form, params=query_parameters, headers=headers) as response:
                if response.status == 200:
                    return await response.read()
                else:
                    print(f"Request failed with status: {response.status}")
                    return None
    except Exception as e:
        print(f"Error in send_post_request: {e}")
        return None


async def remove_bg(file_bytes, metadata):
    try:
        url = "http://" + getenv("REM_HOST") + f":7001/api/remove"

        img = await send_post_request(url, file_bytes, metadata)

        if img:
            return img
        else:
            raise Exception("Image processing failed")
    except Exception as e:
        print(f"Error in remove_bg: {e}")
        return b""
