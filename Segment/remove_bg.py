import io
from upload_s3 import upload_s3
from Model import Model


def remove_bg(bytes, metadata):

    img = Model.remove(bytes, cc=metadata['type'])
    in_mem_file = io.BytesIO(img)

    in_mem_file.seek(0)
    upload_s3(in_mem_file, metadata)
