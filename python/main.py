import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OpenAI_API_Key = os.environ.get("OPENAI_API_KEY")

def show_json(obj):
  print(json.loads(obj.model_dump_json()))


client = OpenAI(api_key=OpenAI_API_Key)

def create_assistant():
  assistant = client.beta.assistants.create(
    name="Fitness-Senseii",
    model="gpt-4-1106-preview",
    instructions="You are a teacher and a fitness coach. You help your users to achieve their fitness goals by creating plans. When the users tell you their fitness goals, you ask them all the necessary questions that are needed to formulate the plan. In your plan you definitely contain three things. A little summary about user's current fitness status. A Workout Plan telling what exercise to do on which day of the week. A Diet plan of what the user will eat on each day of the week and at what time depending on the user's preferences which you know by asking them questions before creating the plans."
    )
  
  return assistant

assistant = create_assistant()
print(assistant)
show_json(assistant)