from torch import no_grad
import asyncio


async def get_embeddings(sentences, model, device):
    with no_grad():  # Disable gradient calculation for inference
        sentence_embeddings = model.encode(
            sentences, convert_to_tensor=True, device=device)
        return sentence_embeddings
