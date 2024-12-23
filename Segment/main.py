import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from remove_bg import remove_bg
from generate_tags import generate_tags
from transformers import ViTImageProcessor, ViTForImageClassification
from contextlib import asynccontextmanager


VIT = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # During Start-Up
    VIT["processor"] = ViTImageProcessor.from_pretrained(
        'google/vit-base-patch16-224')
    VIT["model"] = ViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224')
    yield
    # During Shut-Down

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


@app.get("/")
async def home():
    """Health check endpoint."""
    return create_response({"result": "success"})


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_ID: str = Form(...),
    clothing_ID: str = Form(...),
    type: str = Form(...),
):
    try:

        meta_data = {"uid": user_ID, "cid": clothing_ID, "type": type}

        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")

        print("Starting background removal...")
        rem_bg_image = await remove_bg(file_content, meta_data)

        print("Generating tags...")
        tags = await generate_tags(rem_bg_image, **VIT)
        print("Successfully processed the file and generated tags")

        return create_response(
            {"Tags": tags, "status": "File received successfully"}
        )
    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
