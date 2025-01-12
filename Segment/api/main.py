from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .dependencies import lifespan
from .routers import outfits, clothing

description = """
Outfit.ai APIs

Allows for Creating :
- Outfits
- Clothing
"""

app = FastAPI(
    title="outfit-ai",
    description=description,
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(outfits.router)
app.include_router(clothing.router)
