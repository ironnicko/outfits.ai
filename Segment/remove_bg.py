import io
from rembg import remove

from upload_s3 import upload_s3


def remove_bg(bytes, metadata):

    img = remove(bytes, force_return_bytes=1)
    in_mem_file = io.BytesIO(img)
    # img.save(in_mem_file, format="PNG")
    in_mem_file.seek(0)
    upload_s3(in_mem_file, metadata)
