import io
import os
import onnxruntime as ort
import numpy as np
from PIL import Image
from scipy.special import log_softmax


palette1 = [
    0,
    0,
    0,
    255,
    255,
    255,
    0,
    0,
    0,
    0,
    0,
    0,
]

palette2 = [
    0,
    0,
    0,
    0,
    0,
    0,
    255,
    255,
    255,
    0,
    0,
    0,
]

palette3 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    255,
    255,
    255,
]


def naive_cutout(img, mask):

    empty = Image.new("RGBA", (img.size), 0)
    cutout = Image.composite(img, empty, mask)
    return cutout


def preprocess_image(image_path, input_size, mean, std):

    image = Image.open(io.BytesIO(image_path)).convert("RGB")

    image = image.resize(input_size, Image.Resampling.LANCZOS)

    image_np = np.array(image)
    image_np = image_np / np.max(image_np)

    tmpImg = np.zeros((image_np.shape[0], image_np.shape[1], 3))
    tmpImg[:, :, 0] = (image_np[:, :, 0] - mean[0]) / std[0]
    tmpImg[:, :, 1] = (image_np[:, :, 1] - mean[1]) / std[1]
    tmpImg[:, :, 2] = (image_np[:, :, 2] - mean[2]) / std[2]

    tmpImg = tmpImg.transpose((2, 0, 1))

    return np.expand_dims(tmpImg, 0).astype(np.float32)


def get_concat_v_multi(imgs):
    pivot = imgs.pop(0)
    for im in imgs:
        pivot = get_concat_v(pivot, im)
    return pivot


def get_concat_v(img1, img2):

    dst = Image.new("RGBA", (img1.width, img1.height + img2.height))
    dst.paste(img1, (0, 0))
    dst.paste(img2, (0, img1.height))
    return dst


def remove(image, *args, **kwargs):
    cwd = os.getcwd()
    print(cwd)
    model_path = os.path.join(cwd, "u2net_cloth_seg.onnx")
    onnx_session = ort.InferenceSession(model_path)

    input_name = onnx_session.get_inputs()[0].name
    output_name = onnx_session.get_outputs()[0].name

    input_size = (768, 768)
    original_image = Image.open(io.BytesIO(image))
    original_image = original_image.resize(input_size)
    input_tensor = preprocess_image(
        image, input_size, (0.485, 0.456, 0.406), (0.229, 0.224, 0.225))

    outputs = onnx_session.run([output_name], {input_name: input_tensor})
    pred = outputs
    pred = log_softmax(pred[0], 1)
    pred = np.argmax(pred, axis=1, keepdims=True)
    pred = np.squeeze(pred, 0)
    pred = np.squeeze(pred, 0)

    mask = Image.fromarray(pred.astype("uint8"), mode="L")
    mask = mask.resize(input_size, Image.Resampling.LANCZOS)

    masks = []

    cloth_category = kwargs.get("cc") or kwargs.get("cloth_category")

    def upper_cloth():
        mask1 = mask.copy()
        mask1.putpalette(palette1)
        mask1 = mask1.convert("RGB").convert("L")
        masks.append(mask1)

    def lower_cloth():
        mask2 = mask.copy()
        mask2.putpalette(palette2)
        mask2 = mask2.convert("RGB").convert("L")
        masks.append(mask2)

    def full_cloth():
        mask3 = mask.copy()
        mask3.putpalette(palette3)

        mask3 = mask3.convert("RGB").convert("L")
        masks.append(mask3)

    if cloth_category == "upper":
        upper_cloth()
    elif cloth_category == "lower":
        lower_cloth()
    elif cloth_category == "full":
        full_cloth()
    else:
        upper_cloth()
        lower_cloth()
        full_cloth()

    cutouts = []

    for mask in masks:

        cutout = naive_cutout(original_image, mask)

        cutouts.append(cutout)

    cutout = original_image
    if len(cutouts) > 0:
        cutout = get_concat_v_multi(cutouts)
    cutout.show()
    image_bytes = io.BytesIO()
    cutout.save(image_bytes, format="PNG")
    image_bytes = image_bytes.getvalue()

    return image_bytes
