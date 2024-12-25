
import asyncio


async def encode_sentences(sentences, model):

    embeddings = await asyncio.to_thread(model.encode, sentences)
    return embeddings


async def insert_embeddings(sentences, conn, model):

    embeddings = await encode_sentences(sentences, model)

    try:
        async with conn.cursor() as cur:

            await cur.execute("""
                CREATE TABLE IF NOT EXISTS vectors (
                    id serial PRIMARY KEY,
                    user_id int8 REFERENCES users(id),
                    embedding vector(768),
                    text text
                )
            """)

            for index, embedding in enumerate(embeddings):
                embedding_str = "[" + \
                    ", ".join(map(str, embedding.tolist())) + "]"
                await cur.execute(
                    "INSERT INTO vectors (user_id, embedding, text) VALUES (%s, %s, %s)",
                    (1, embedding_str, sentences[index])
                )

        await conn.commit()
    except Exception as e:
        print(e)
