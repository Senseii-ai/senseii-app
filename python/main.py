import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
OpenAI_API_Key = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

client = OpenAI(api_key=OpenAI_API_Key)

thread_id: str = "thread_2kTDrLy8vDM5d5owzGH8K9sA"
message_id: str = "msg_ztu5xKokeGwTrJntsMpnZYPj"
assistant_id: str = "asst_ZTRzwXIKCT0ALgQx8eBTDkSH"


@app.get("/")
def ping():
    return {"Message": "Pong"}


@app.get("/create")
def create_assistant():
    assistant = client.beta.assistants.create(
        name="Fitness-Senseii",
        model="gpt-4-1106-preview",
        instructions="You are a teacher and a fitness coach. You help your users to achieve their fitness goals by creating plans. When the users tell you their fitness goals, you ask them all the necessary questions that are needed to formulate the plan. In your plan you definitely contain three things. A little summary about user's current fitness status. A Workout Plan telling what exercise to do on which day of the week. A Diet plan of what the user will eat on each day of the week and at what time depending on the user's preferences which you know by asking them questions before creating the plans.",
    )

    return {"message": "Assostant Created Successfully", "data": assistant}


@app.get("/thread")
def create_thread():
    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="I am 21 years old, and 107KGs, I want to loose almost 20kgs in the next 4 months.",
    )

    print("Message", message)

    return {"data": thread}


@app.get("/chat")
def chat():
    run = client.beta.threads.runs.create(
        thread_id=thread_id, assistant_id=assistant_id
    )
    print(run)

    return {"data": run}


@app.get("/list")
def list_messages():
    messages = client.beta.threads.messages.list(thread_id=thread_id)

    return messages
