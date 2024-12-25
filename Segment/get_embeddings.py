
import asyncio


async def encode_sentences(sentences, model):

    embeddings = await asyncio.to_thread(model.encode, sentences)
    return embeddings


async def get_embeddings(sentences, model):

    return await encode_sentences(sentences, model)
