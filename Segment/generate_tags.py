from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import numpy as np
from io import BytesIO
import asyncio


async def generate_tags(file_content):
    print("Generating Tags")
    return await asyncio.to_thread(_generate_tags_sync, file_content)


def _generate_tags_sync(file_content):

    image = Image.open(BytesIO(file_content)).convert("RGB")

    processor = ViTImageProcessor.from_pretrained(
        'google/vit-base-patch16-224')
    model = ViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224')

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits.detach().numpy()

    top_k = 5
    top_k_indices = np.argsort(logits[0])[::-1][:top_k]
    top_k_classes = [model.config.id2label[idx] for idx in top_k_indices]
    return top_k_classes
