import asyncio
from hypercorn.config import Config
from hypercorn.asyncio import serve
from api.main import app

async def main():
    config = Config()
    config.bind = ["0.0.0.0:8001"]
    config.quic_bind = ["0.0.0.0:8001"]

    await serve(app, config)
if __name__ == "__main__":
    asyncio.run(main())

