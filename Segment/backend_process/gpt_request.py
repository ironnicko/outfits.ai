import json
import base64


async def gpt_request(client, img: bytes, filename: str, prompt: str, body: str = None):

    image_message = []
    if img:
        b64_image = base64.b64encode(img).decode("utf-8")
        image_message = [{
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{b64_image}"
            }
        }]

    messages = [{"role": "system", "content": prompt}]

    if body:
        messages.append({"role": "user", "content": body})
    elif img:
        messages.append({
            "role": "user",
            "content": [
                {"type": "text", "text": "Here's the image:"},
                *image_message
            ]
        })

    response = await client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
    )

    content = response.choices[0].message.content

    content = content.split("</think>")[-1].strip().replace("\n", " ")
    content = content.lstrip("```json").rstrip("```").strip()

    return json.loads(content)


async def create_combinations(client, prompt, body):
    response = await gpt_request(client, img=None, filename=None, prompt=prompt, body=body)
    response = [json.dumps(r) for r in response]
    response = set(response)
    response = list(response)
    response = [json.loads(r) for r in response]
    return response
