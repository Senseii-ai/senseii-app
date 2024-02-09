from openai_utils.assistants.client import get_openai_client
from utils.constants import (
    DIET_ASSISTANT_NAME,
    DIET_ASSISTANT_INSTRUCTION,
    DIET_ASSISTANT_DESCRIPTION,
    GPT_4_MODEL,
)
from openai_utils.assistants.assistants import create_assistant, get_assistant

client = get_openai_client()


def create_diet_assistant():
    assistant = create_assistant(
        name=DIET_ASSISTANT_NAME,
        description=DIET_ASSISTANT_DESCRIPTION,
        instructions=DIET_ASSISTANT_INSTRUCTION,
        model=GPT_4_MODEL,
    )


def get_diet_assistant():
    return get_assistant(DIET_ASSISTANT_NAME)
