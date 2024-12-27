import json


prompt = """
Provided below is the image of clothing article, you need to give me the color, type, and tags in the following format as plain-text:
{\"color\" : <the color of the clothing>,\"type\": <the type of the clothing>,\"Tags\": {<generate an array of tags describing the clothing article along with the occasion of the clothing article>}}
The 'type' must fall under the following categories:
upper, lower, full, shoe, accessories, others

Don't generate less than 5 Tags and no more than 7
"""


async def gpt_request(client, url):
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
    response = ""
    async for chunk in completion:
        response += chunk.choices[0].delta.content or ""
    response = response.rstrip("```").lstrip("```json")
    return json.loads(response)
