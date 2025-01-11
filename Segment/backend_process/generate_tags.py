from PIL import Image
import numpy as np
from io import BytesIO
import asyncio


async def generate_tags(file_content, model, processor):
    print("Generating Tags")
    return await asyncio.to_thread(_generate_tags_sync, file_content, model, processor)


def _generate_tags_sync(file_content, model, processor):

    image = Image.open(BytesIO(file_content)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits.detach().numpy()

    top_k = 5
    top_k_indices = np.argsort(logits[0])[::-1][:top_k]
    top_k_classes = [model.config.id2label[idx] for idx in top_k_indices]
    return top_k_classes
