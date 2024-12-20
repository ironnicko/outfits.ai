from openai import AsyncOpenAI
import asyncio
import base64


client = AsyncOpenAI()
client.base_url = "https://free.v36.cm/v1/"

with open("/Users/nikhilivannan/Downloads/IMPORTANT/dress.jpg", "rb") as file:
    img_data = base64.b64encode(file.read())


url = f"data:image/jpeg;base64,{img_data.decode('utf-8')}"
prompt = "I'll provide you with images of clothes, you need to give me their color and style in the following format:{\"color\" : <the color of the clothing>, \"style\": <the style of the clothing>}"


async def main():
    completion = await client.chat.completions.create(
        model="gpt-4o-mini",
        extra_headers={'x-foo': 'true'},
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text",
                     "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": url}
                    }
                ]
            }
        ],
        stream=True
    )
    async for chunk in completion:
        print(chunk.choices[0].delta.content or "", end="")
asyncio.run(main())
