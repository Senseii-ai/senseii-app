from openai_utils.assistants.client import get_openai_client
from utils.constants import (
    WORKOUT_ASSISTANT_DESCRIPTION,
    WORKOUT_ASSISTANT_INSTRUCTIONS,
    WORKOUT_ASSISTANT_NAME,
    GPT_4_MODEL,
)
from openai_utils.assistants.assistants import create_assistant, get_assistant

client = get_openai_client()


def create_workout_assistant():
    assistant = create_assistant(
        name=WORKOUT_ASSISTANT_NAME,
        description=WORKOUT_ASSISTANT_DESCRIPTION,
        instructions=WORKOUT_ASSISTANT_INSTRUCTIONS,
        model=GPT_4_MODEL,
    )
    return assistant


# get workout_assistant returns the workout assistant
def get_workout_assistant():
    return get_assistant(WORKOUT_ASSISTANT_NAME)
