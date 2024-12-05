from io import BytesIO
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from PIL import Image
from segment import perform_segmentation
from remove_bg import remove_bg
app = FastAPI()


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_ID: str = Form(...),
    clothing_ID: str = Form(...),

):
    try:

        meta_data = {'uid': user_ID,
                     'cid': clothing_ID, }
        file_content = await file.read()

        remove_bg(file_content, meta_data)
        # bytes = BytesIO(file_content)
        # perform_segmentation(bytes, meta_data)

        return JSONResponse(content={"filename": file.filename, "status": "File received successfully"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8001)
