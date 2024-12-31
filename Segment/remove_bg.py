import io
import json
import aiohttp
import dotenv
from os import getenv
from PIL import Image

dotenv.load_dotenv()

W, H = 720, 720


async def send_post_request(url, file_bytes, metadata):
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img = img.resize((W, H))

        side_length = 75

        top_left_x = (W - side_length) >> 1
        top_left_y = (H - side_length) >> 1
        bottom_right_x = top_left_x + side_length
        bottom_right_y = top_left_y + side_length

        file_bytes = io.BytesIO()
        img.save(file_bytes, "png")
        file_bytes = file_bytes.getvalue()
        headers = {
            "accept": "application/json",
        }

        extras = {
            "sam_prompt": [
                {
                    "type": "point",
                    "data": [top_left_x, top_left_y],
                    "label": 1
                },
                {
                    "type": "point",
                    "data": [bottom_right_x, bottom_right_y],
                    "label": 1
                },
                {
                    "type": "point",
                    "data": [top_left_x, bottom_right_y],
                    "label": 1
                },
                {
                    "type": "point",
                    "data": [bottom_right_x, top_left_y],
                    "label": 1
                },

            ]
        }
        query_parameters = {
            "extras": json.dumps(extras)
        }

        form = aiohttp.FormData()
        form.add_field('file', file_bytes, filename=metadata["filename"],
                       content_type="image/png")
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
