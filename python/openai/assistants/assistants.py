# This file holds all the interactions with the assistants
from openai.assistants.client import get_openai_client
import logging
import os
from dotenv import load_dotenv

load_dotenv()

client = get_openai_client()

def get_core_assistant():
    assistant_id = os.environ.get("CORE_ASSISTANT_ID") 
    return get_assistant(assistant_id)


# get all assistants.
def get_all_assistant():
    assistants = client.beta.assistants.list(order="asc", limit=20)

    for assistant in assistants.data:
        print(assistant.name)

    return assistants


# get one assistant.
def get_assistant(assistant_id: str):

    return client.beta.assistants.retrieve(assistant_id)


# create assistant
def create_assistant(name: str, description: str, instructions: str, model: str):
    assistant = check_if_exists(name)
    if assistant is None:
        logging.info("Assistant does not exist, creating new")
        assistant = client.beta.assistants.create(
            name, description, instructions, model
        )
        logging.info("Assistant created successfully")
        return assistant
    return assistant


# check if an assistant already exists
def check_if_exists(name: str):
    assistants = get_all_assistant()

    for assistant in assistants.data:
        if name == assistant.name:
            return assistant
    return None

