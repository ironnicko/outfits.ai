import json
import os
from typing import List
import g4f
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from gpt_request import create_combinations, gpt_request
from remove_bg import remove_bg
from contextlib import asynccontextmanager
from sentence_transformers import SentenceTransformer
from get_embeddings import get_embeddings
from upload_s3 import upload_s3
from pydantic import BaseModel

EMBED = {}
LLM = {}

DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_USERNAME = os.getenv("DB_USERNAME")

prompt1 = """
Provided below is the image of clothing article, you need to give me the color, type, and tags in the following format as plain-text:
{\"color\" : <the color of the clothing>, \"clothingType\": <the type of the clothing>, \"Tags\": {<generate an array of tags describing the clothing article along with the occasion of the clothing article>}}
The 'type' must fall under the following categories:
top, bottom, shoe, hat, others

Don't generate less than 5 Tags and no more than 7

Except 'Tags' nothing else will be an array

The reply must be plain-text.
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    # During Start-Up

    EMBED["model"] = SentenceTransformer(
        'sentence-transformers/all-MiniLM-L6-v2')
    LLM["client"] = g4f.AsyncClient(provider=g4f.Provider.Blackbox)
    yield
    # During Shut-Down
    EMBED.clear()
    LLM.clear()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_response(content, status_code=200):
    return JSONResponse(content=content, status_code=status_code)


@ app.get("/")
async def home():
    """Health check endpoint."""
    return create_response({"result": "success"})


@app.post("/embedding")
async def embedding(
    occasion: str = Form(...)
):
    embedding = await get_embeddings([occasion], **EMBED)

    return create_response({"embedding": json.dumps(embedding.tolist()[0])})


@app.post("/generate-outfits")
async def generate_outfits(
    clothes: str = Form(...),
    pairWithArticles: str = Form(...)
):


    part1 = """
    Given lastly are the properties of clothing articles, and you need to make multiple combinations of outfits using the same.

    Ensure to use the color property to match them properly as per latest trends.
    An outfit contains the following types of clothing article: 
    - top
    - bottom
    - shoe
    - hat

    you will output the outfit combinations like follows:
    [{top : <ID of a top clothing article>, bottom : <ID of a bottom clothing article>, shoe: <ID of a shoe clothing article>, hat: <ID of a hat>}, ...]
    make sure you don't exceed more than 10 combinations, no repetition, and only use the given clothing articles.
    use the tags given as well in your outfit combinations.
    given articles will be JSON, and you will output in JSON as well.
    if there's no clothing article for a particular type, you may enter a '-1' in there.
    Last set of articles will remain fixed in all combinations, meaning their ID will be constant in all combinations of their respective types. So ensure to create a combination that matches the fixed articles.
    OUTPUT must be only an array of JSON.

    Here's the clothing articles:

    """
    part2 = clothes
    part3 = "\n\nHere's clothing articles that will remain fixed:\n"
    part3 += pairWithArticles

    return await create_combinations(**LLM, prompt=part1 + part2 + part3)


@app.post("/mixmatch")
async def mixmatch(
    file: UploadFile = File(...),
):
    try:
        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")
        print("Starting background removal...")
        meta_data = {"filetype": file.content_type, "filename": file.filename}
        rem_bg_image: str = await remove_bg(file_content, meta_data)

        print("Generating tags...")
        response: dict = await gpt_request(**LLM, prompt=prompt1, img=rem_bg_image, filename=file.filename)

        text = " ".join(response["Tags"])
        embedding = await get_embeddings([text], **EMBED)

        # using this embedding, find top, bottom, shoe, accessories that are close to this

        # create at best 10 outfits

        return response

    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)


@app.post("/outfitcheck")
async def outfitcheck(
    file: UploadFile = File(...),
):
    try:
        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")
        prompt = """
        Provided below is the image of a person with their outfit, you need to give me what they are doing well,
        what they are not doing well, and what they can do to improve their outfit.

        Also provide a score out of 5. Only integer scores.

        OUTPUT FORMAT:
        {
            "DoingWell" : <string describing what person is doing well>,
            "NotDoingWell" : <string describing what person is not doing well, make sure to be friendly>,
            "Improvements" : <string describing what person can improve>,
            "Score" : <integer>

        }

        Keep it concise, informal, and under 120 words.

        The reply must be JSON.
        """
        response: dict = await gpt_request(**LLM, prompt=prompt, img=file_content, filename=file.filename)

        return response

    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)


@ app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_ID: str = Form(...),
    clothing_ID: str = Form(...),
):
    try:

        meta_data = {"uid": user_ID, "cid": clothing_ID,
                     "filetype": file.content_type, "filename": file.filename}

        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")

        print("Starting background removal...")
        rem_bg_image: str = await remove_bg(file_content, meta_data)
        print("Generating tags...")

        response: dict = await gpt_request(**LLM, prompt=prompt1, img=rem_bg_image, filename=file.filename)
        print("Successfully processed the file and generated tags")
        print(response)
        meta_data["type"] = response["clothingType"]

        if meta_data["type"] == "others":
            return create_response({"error": "invalid clothing type"}, status_code=400)

        await upload_s3(rem_bg_image, meta_data)

        text = " ".join(response["Tags"])
        embedding = await get_embeddings([text], **EMBED)

        response.update({
            "status": "File received successfully",
            "Embedding": json.dumps(embedding.tolist()[0]),
        })

        return create_response(response)
    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
