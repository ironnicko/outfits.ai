from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.responses import JSONResponse
from openai import AsyncOpenAI
from sentence_transformers import SentenceTransformer
import torch


EMBED = {}
LLM = {}


prompt = """
Provided below is the image of clothing article, you need to give me the color, type, and tags in the following format as plain-text:
{\"color\" : <the color of the clothing>, \"clothingType\": <the type of the clothing>, \"Tags\": [<generate an array of tags describing the clothing article along with the occasion of the clothing article>]}
The 'type' must fall under the following categories:
top, bottom, shoe, hat, others

Don't generate less than 5 Tags and no more than 12.
A dress will be considered a top, but make sure to add the tag 'dress' in the tags.
Tags must be about the clothing rather than the contents in the image.
Make the tags as specific as possible, try not to be generic like eg: men's fashion. The preceeding example is something that shouldn't be a tag.

Except 'Tags' nothing else will be an array.

The reply must be plain-text.
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    # During Start-Up
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("Using CUDA")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
        print("Using MPS")
    else:
        device = torch.device("cpu")
        print("Using CPU")

    EMBED["device"] = device
    EMBED["model"] = SentenceTransformer(
        'sentence-transformers/all-MiniLM-L6-v2')

    EMBED["model"].to(device)
    LLM["client"] = AsyncOpenAI()
    yield
    # During Shut-Down
    EMBED.clear()
    LLM.clear()


def create_response(content, status_code=200):
    return JSONResponse(content=content, status_code=status_code)
