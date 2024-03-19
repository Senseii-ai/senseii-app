from openai import OpenAI
from utils.constants import GPT_4_MODEL, CORE_ASSISTANT_DESCRIPTION, CORE_ASSISTANT_NAME, CORE_ASSISTANT_INSTRUCTIONS
from openai.assistants.assistants import get_assistant, get_core_assistant
from openai.assistants.client import get_openai_client
from openai.assistants.threads import create_thread

clint = get_openai_client()

# This function is responsible for creating a thread and running it.the API route for this would be chat/create
def create_chat(thread_id: str| None = None):
    core_assistant = get_core_assistant()
    thread : str
    if not thread_id:
        thread = create_thread()
        # attach the thread in the response and to the user's profile
    
    # create a run with the user's message in the thread
    
