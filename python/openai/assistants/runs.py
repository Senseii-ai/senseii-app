from assistants.client import get_openai_client

client = get_openai_client()

# TODO: Add typesafety to the function
def create_streaming_run(assistant_id , thread_id: str, messages):
    return client.beta.assistants

def create_run(assistant_id: )