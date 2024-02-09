# This file holds all the interactions with the assistants
from openai_utils.assistants.client import get_openai_client

client = get_openai_client()


# get all assistants.
def get_all_assistant():
    assistants = client.beta.assistants.list(order="asc", limit=20)

    for assistant in assistants.data:
        print(assistant.name)

    return assistants


# get one assistant.
def get_assistant(name: str):
    return client.beta.assistants.retrieve(name)


# create assistant
def create_assistant(name, description, instructions: str):
    if check_if_exists() is None:
        assistant = client.beta.assistants.create(
            name, description, instructions, model="gpt-4-1106-preview"
        )
        return assistant


# check if an assistant already exists
def check_if_exists(name: str):
    assistants = get_all_assistant()

    for assistant in assistants.data:
        if name == assistant.name:
            return assistant
    return None
