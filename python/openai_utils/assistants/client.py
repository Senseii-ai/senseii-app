from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

_openai_client = None


def get_openai_client():
    OpenAI_API_Key = os.environ.get("OPENAI_API_KEY")
    global _openai_client
    if _openai_client is None:
        if not OpenAI_API_Key:
            raise ValueError("No OpenAI Key available")
        _openai_client = OpenAI(api_key=OpenAI_API_Key)
    return _openai_client
