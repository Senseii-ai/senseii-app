# This file is going to be used to manage threads.
from openai.assistants.client import get_openai_client

client = get_openai_client()


# create_thread creates a new thread.
def create_thread():
    return client.beta.threads.create()


# get_thread gets a single thread using the thread id.
def get_thread(thread_id):
    return client.beta.threads.retrieve(thread_id)


# list thread messages
def list_thread_messages(thread_id):
    thread_messages = client.beta.threads.messages.list(thread_id)
    return thread_messages
