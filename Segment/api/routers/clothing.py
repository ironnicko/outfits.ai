import json
from ..dependencies import prompt, EMBED, LLM, create_response
from backend_process import gpt_request, remove_bg, get_embeddings, upload_s3
from fastapi import BackgroundTasks, File, UploadFile, Form, HTTPException, APIRouter

router = APIRouter(
    prefix="/clothing",
    tags=["clothes"]
)


async def run_sam(file, meta_data):
    if meta_data["type"] != "shoe":
        print("Running Background Task...")
        try:
            rem_bg_image: str = await remove_bg(file, meta_data, "sam")
            await upload_s3(rem_bg_image, meta_data)
        except:
            return


@router.post("/embedding")
async def embedding(
    occasion: str = Form(...)
):
    embedding = await get_embeddings([occasion], **EMBED)

    return create_response({"embedding": json.dumps(embedding.tolist()[0])})


@router.post("/upload")
async def upload_file(
    background_task: BackgroundTasks,
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
        response: dict = await gpt_request(**LLM, prompt=prompt, img=rem_bg_image, filename=file.filename)
        print(response)
        meta_data["type"] = response["clothingType"]

        if meta_data["type"] == "others":
            return create_response({"error": "invalid clothing type"}, status_code=400)

        print("Uploading to S3")
        await upload_s3(rem_bg_image, meta_data)

        text = " ".join(response["Tags"])
        embedding = await get_embeddings([text], **EMBED)

        response.update({
            "status": "File received successfully",
            "Embedding": json.dumps(embedding.tolist()[0]),
        })

        # background_task.add_task(run_sam, file_content, meta_data)

        return create_response(response)
    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)
