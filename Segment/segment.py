from model import segment_clothing
from PIL import Image
import io
from upload_s3 import upload_s3


def perform_segmentation(bytes, metadata):

    image = Image.open(bytes)

    images = segment_clothing(img=image)

    key = "Composite"

    in_mem_file = io.BytesIO()
    images[key].save(in_mem_file, format="PNG")
    in_mem_file.seek(0)
    # reset file pointer to start
    upload_s3(in_mem_file, metadata)


# perform_segmentation(b"0x15", "test.png", )
