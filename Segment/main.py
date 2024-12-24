import uvicorn
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from remove_bg import remove_bg
from generate_tags import generate_tags

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {"result": "success"}


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_ID: str = Form(...),
    clothing_ID: str = Form(...),
    type: str = Form(...)

):
    try:

        meta_data = {'uid': user_ID,
                     'cid': clothing_ID,
                     'type': type}
        file_content = await file.read()
        print("Starting Process...")
        rem_bg_image = await remove_bg(file_content, meta_data)
        tags = generate_tags(rem_bg_image)
        print("Successfully Generated Tags")

        return JSONResponse(content={"Tags": tags, "status": "File received successfully"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8001)
