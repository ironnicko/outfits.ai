import json
from ..dependencies import prompt, EMBED, LLM, create_response
from backend_process import gpt_request, remove_bg, get_embeddings, create_combinations
from fastapi import File, UploadFile, Form, HTTPException, APIRouter

router = APIRouter(
    prefix="/outfit",
    tags=["outfits"]
)


@router.post("/generate-outfits")
async def generate_outfits(
    clothes: str = Form(...),
    occasion: str = Form(...),
    pairWithArticles: str = Form(...)
):

    prompt = """
    Given lastly are the properties of clothing articles, and you need to make multiple combinations of outfits using the same.

    Ensure to use the color property to match them properly as per latest trends.
    An outfit contains the following types of clothing article: 
    - top
    - bottom
    - shoe
    - hat

    you will output the outfit combinations like the following:
    [
    {
        top : <ID of a top clothing article>, 
        bottom : <ID of a bottom clothing article>,
        shoe: <ID of a shoe clothing article>, 
        hat: <ID of a hat>,
        description: <provide description for why this outfit goes together well. Keep it concise and under 150 words.>
    },
    ...]
    make sure you don't exceed more than 10 combinations, no repetition.
    only use the given clothes. Do not make up ID's, use only clothing ID's from
    use the tags given as well in your outfit combinations.
    given articles will be JSON, and you will output in JSON as well.
    if there's no clothing article for a particular type, you may enter a '-1' in there.
    Last set of articles will remain fixed in all combinations, meaning their ID will be constant in all combinations of their respective types. So ensure to create a combination that matches the fixed articles.
    OUTPUT must be only an array of JSON.
    if some clothing doesn't match well based on the occasion you can skip it. Ex: pants can't be worn for working out.
    Try not to give single clothing outfit recommendations if possible.

    """
    body = "\n\nHere's the clothing articles:\n"
    body += clothes
    body += "\n\nHere's clothing articles that will remain fixed:\n"
    body += pairWithArticles
    body += "\n\nThis is the occasion:"
    body += occasion

    output = await create_combinations(**LLM, prompt=prompt, body=body)

    dictionary = {}
    for element in output:
        dictionary[(element['top'], element['bottom'],
                    element['shoe'], element['hat'])] = element

    return list(dictionary.values())


@router.post("/get-opinion")
async def get_opinion(
    clothing: str = Form(...),
    clothes: str = Form(...)
):
    prompt = """
        Given are some clothes and their properties to which the given clothing is similar to,
        You are required to give a description as to why the clothing will go along with the given clothes.
        Also provide a rating from 0 - 5 which describes if the clothing will be a good purchase or not.
        Do not be overtly positive, be little blunt and honest, and do not repeatedly use 'dude'.
        Output Format:
        {
            "explanation" :  <provide the description as to why the clothing will go along with the clothes. Make it informal and casual>,
            "rating" : <integer>
        } 
        Ensure that the description is mainly relevant to the given clothes, try not to be highly generic.
    """
    body = "Here's the clothes:\n"
    body += clothes
    body = "Here's the clothing:\n"
    body += clothing

    response: dict = await gpt_request(**LLM, prompt=prompt, body=body, img=None, filename=None)

    return response


@router.post("/mixandmatch")
async def mix_and_match(
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
        response: dict = await gpt_request(**LLM, prompt=prompt, img=rem_bg_image, filename=file.filename)

        text = " ".join(response["Tags"])
        embedding = await get_embeddings([text], **EMBED)
        response["embedding"] = json.dumps(embedding.tolist()[0])
        return response

    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)


@router.post("/colortherapy")
async def color_therapy(
    file: UploadFile = File(...),
    Data: str = Form(...)
):
    try:
        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")
        prompt = """
        Analyze the provided image to determine the user's seasonal color type (Spring, Summer, Autumn, or Winter) based on their skin tone, undertone, hair color, and eye color. Then, generate a custom clothing color palette with hex codes that complement their season.

        ### Steps for Analysis:
        1. Skin Analysis:
        - Detect the skin tone (Fair, Light, Medium, Tan, Deep).
        - Identify undertones (Warm, Cool, Neutral, Olive).
        
        2. Hair Analysis:
        - Identify the natural hair color.
        - Determine whether the hair has warm, cool, or neutral tones.

        3. Eye Analysis:
        - Identify the user's eye color.
        - Determine if it has warm or cool tones.

        4. Determine Seasonal Color Type:
        - Based on the above features, classify the user into one of the four Korean seasonal color types:
            - Spring (Warm & Light)
            - Summer (Cool & Light)
            - Autumn (Warm & Deep)
            - Winter (Cool & Deep)

        5. Generate a Custom Color Palette:
        - Provide a clothing color palette with at least 10 colors best suited for the user's season.
        - Each color should include:
            - Name (e.g., Soft Peach, Cool Lilac)
            - Hex Code (e.g., `#F4A7B9`)

        Output the Results in JSON Format:
        - The OUTPUT must be an array of JSON with the following structure and no other text:
        ex:
        [
            {
            "seasonal_color_type": "Spring",
            "skin_tone": "Light",
            "undertone": "Warm",
            "hair_color": "Golden Brown",
            "eye_color": "Hazel",
            "clothing_color_palette": [
                {"name": "Soft Peach", "hex": "#FFDAB9"},
                {"name": "Warm Coral", "hex": "#FF6F61"},
                {"name": "Golden Beige", "hex": "#F5DEB3"},
                {"name": "Apricot", "hex": "#E9967A"},
                {"name": "Mint Green", "hex": "#98FB98"},
                {"name": "Sky Blue", "hex": "#87CEEB"},
                {"name": "Light Periwinkle", "hex": "#C3CDE6"},
                {"name": "Sunflower Yellow", "hex": "#FFC300"}
            ]
            },
            ...
        ]


        """
        response: dict = await gpt_request(**LLM, prompt=prompt, img=file_content, filename=file.filename)

        return response

    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)


@router.post("/outfitcheck")
async def outfit_check(
    file: UploadFile = File(...),
):
    try:
        file_content = await file.read()
        if not file_content:
            raise HTTPException(
                status_code=400, detail="Uploaded file is empty")
        prompt_outfit_check = """
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
        response: dict = await gpt_request(**LLM, prompt=prompt_outfit_check, img=file_content, filename=file.filename)

        return response

    except HTTPException as http_exc:
        return create_response({"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return create_response({"error": "An unexpected error occurred."}, status_code=500)
