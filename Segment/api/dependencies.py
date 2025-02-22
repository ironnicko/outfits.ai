from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.responses import JSONResponse
import g4f
from sentence_transformers import SentenceTransformer


EMBED = {}
LLM = {}


prompt = """
Provided below is the image of clothing article, you need to give me the color, type, and tags in the following format as plain-text:
{\"color\" : <the color of the clothing>, \"clothingType\": <the type of the clothing>, \"Tags\": {<generate an array of tags describing the clothing article along with the occasion of the clothing article>}}
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

    EMBED["model"] = SentenceTransformer(
        'sentence-transformers/all-MiniLM-L6-v2')
    LLM["client"] = g4f.AsyncClient(provider=g4f.Provider.Blackbox)
    yield
    # During Shut-Down
    EMBED.clear()
    LLM.clear()


def create_response(content, status_code=200):
    return JSONResponse(content=content, status_code=status_code)
