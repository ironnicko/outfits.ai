from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .dependencies import lifespan
from .routers import outfits, clothing

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(outfits.router)
app.include_router(clothing.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
