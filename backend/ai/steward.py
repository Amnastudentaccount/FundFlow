import asyncio
import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


def _fallback_reasoning(action: str, context: dict | None) -> str:
    details = context or {}
    action_text = action.lower()

    if "bill" in action_text:
        vendor = str(details.get("vendor") or "the vendor")
        try:
            amount = float(details.get("amount", 0))
        except (TypeError, ValueError):
            amount = 0
        if amount and amount <= 150:
            return f"I reviewed the {vendor} bill for ${amount:.2f}; it is within the $150 medical limit."
        if amount:
            return f"I reviewed the {vendor} bill for ${amount:.2f}; it exceeds the $150 medical limit and needs review."
        return f"I reviewed the bill from {vendor} and recorded it for the family pool."

    if "product" in action_text or "search" in action_text:
        query = details.get("query")
        count = details.get("result_count")
        if query and count is not None:
            return f"I searched for {query} and found {count} product options for review."
        if query:
            return f"I searched for {query} and recorded the results for review."
        return "I searched the available products and recorded the results for review."

    return f"I recorded {action.lower()} and checked the available details."


async def generate_reasoning(action: str, context: dict | None = None) -> str:
    """Generate a one-sentence explanation, falling back to local reasoning."""
    fallback = _fallback_reasoning(action, context)
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return fallback

    prompt = (
        "Write exactly one concise, human-readable sentence explaining this family fund action. "
        "Do not invent facts and do not use markdown.\n"
        f"Action: {action}\nContext: {json.dumps(context or {}, default=str)}"
    )
    client = None
    try:
        client = genai.Client(api_key=api_key)
        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            ),
            timeout=10,
        )
        reason = (response.text or "").strip().replace("\n", " ")
        if reason:
            return reason
    except Exception as error:
        print(f"Steward reasoning failed; using fallback: {error}")
    finally:
        if client is not None:
            try:
                await client.aio.aclose()
            except Exception as error:
                print(f"Steward client cleanup failed: {error}")

    return fallback
