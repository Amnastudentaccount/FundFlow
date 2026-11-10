import os

import httpx
from dotenv import load_dotenv

load_dotenv()

MOCK_PRODUCTS = [
    {
        "name": "Lenovo IdeaPad Slim 3 Laptop",
        "price": 549,
        "seller": "TechHub",
        "image": None,
    },
    {
        "name": "Nike Revolution Running Shoes",
        "price": 74,
        "seller": "SportsCorner",
        "image": None,
    },
    {
        "name": "Sony WH-CH720N Headphones",
        "price": 99,
        "seller": "AudioWorld",
        "image": None,
    },
    {
        "name": "Casio Classic Digital Watch",
        "price": 42,
        "seller": "TimeKeepers",
        "image": None,
    },
    {
        "name": "Hydro Flask Water Bottle",
        "price": 35,
        "seller": "OutdoorGoods",
        "image": None,
    },
    {
        "name": "Acer Aspire 5 Laptop",
        "price": 699,
        "seller": "TechHub",
        "image": None,
    },
    {
        "name": "Adidas Runfalcon 3 Shoes",
        "price": 68,
        "seller": "SportsCorner",
        "image": None,
    },
    {
        "name": "JBL Tune 770NC Headphones",
        "price": 129,
        "seller": "AudioWorld",
        "image": None,
    },
]


async def search_products(query: str) -> list:
    api_key = os.getenv("CHANNEL3_API_KEY")
    if not api_key:
        return MOCK_PRODUCTS

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.trychannel3.com/v1/search",
                json={"query": query, "limit": 20, "config": {"mode": "agentic"}},
                headers={"x-api-key": api_key},
            )
            response.raise_for_status()
            payload = response.json()
            products = payload.get("products", [])
            if not isinstance(products, list) or not products:
                return MOCK_PRODUCTS
            mapped_products = []
            for product in products[:20]:
                offer = product["offers"][0]
                images = product.get("images", [])
                mapped_products.append(
                    {
                        "name": product["title"],
                        "price": offer["price"]["price"],
                        "seller": offer["domain"],
                        "image": images[0]["url"] if images else "",
                    }
                )
            return mapped_products
    except Exception as error:
        print(f"Channel3 product search failed; using mock products: {error}")
        return MOCK_PRODUCTS
