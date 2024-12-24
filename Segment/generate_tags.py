from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import numpy as np
from io import BytesIO


def generate_tags(file_content):
    print("Generating Tags")
    image = Image.open(BytesIO(file_content)).convert("RGB")

    processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
    model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits.detach().numpy()  # Convert tensor to numpy array

    top_k = 5
    # Use numpy to get top_k indices
    top_k_indices = np.argsort(logits[0])[::-1][:top_k]  # Sort in descending order

    top_k_classes = [model.config.id2label[idx] for idx in top_k_indices]
    top_k_values = logits[0][top_k_indices]  # Retrieve confidence values for top_k

    for i in range(top_k):
        print(f"{top_k_classes[i]} with confidence {top_k_values[i]:.4f}%")
    return top_k_classes
