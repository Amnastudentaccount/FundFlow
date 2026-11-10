import asyncio


async def extract_bill_data(image_base64: str) -> dict:
    await asyncio.sleep(1.5)
    return {
        "vendor": "Al-Shifa Hospital",
        "amount": 150.00,
        "date": "2024-11-10",
        "category": "Medical",
    }
