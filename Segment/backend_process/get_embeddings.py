from torch import no_grad


async def get_embeddings(sentences, model, device):
    with no_grad():
        sentence_embeddings = model.encode(
            sentences, convert_to_tensor=True, device=device)
        return sentence_embeddings
