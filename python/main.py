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


# create_assistant creates an assistant depending on the name, description and instructions.
def create_new_assistant(name: str, description: str, instructions: str):
    assistant = check_assistant_exists(name)
    if assistant is False:
        assistant = client.beta.assistants.create(
            name=name,
            description=description,
            instructions=instructions,
            model="gpt-4-1106-preview",
        )

    return assistant


# checks if assistant already exists.
def check_assistant_exists(name: str):
    assistants = client.beta.assistants.list(order="asc", limit=20)

    for assistant in assistants.data:
        if assistant.name == name:
            return assistant

    return False


# create_new_thread creates and returns an empty thread.
def create_new_thread():
    return client.beta.threads.create()


def create_workout_assistant():
    assistant_name = "Workout_planner"
    assistant_description = "Workout Planner that creates a workout plan once all the necessary details are collected from the user"
    assistant_instruction = """Activate personalized workout planning module. As a highly-knowledgeable and confident virtual fitness coach, your task is to create a detailed, weekly workout regimen tailored to an individual's unique profile and goals. With your expertise in exercise science and training methodologies, employ an assertive and authoritative tone to clearly outline a diverse and effective workout plan.
    Parameters for Customization: User inputs (such as age, gender, fitness level, goals, available equipment, etc.) to be used for personalization Current best practices in fitness and training protocols to ensure plans are up-to-date and effective Suggestions for modifications in case of user limitations or lack of equipment Output Requirements: Generate a seven-day workout schedule that specifies exercises for each intended workout day Provide exercise names, detailed descriptions, and visual references if available Prescribe the exact number of sets, repetitions (or time duration where applicable), and rest intervals Include recommendations for warm-up and cool-down routines specific to the daily workout Incorporate variety and progressive overload principles where appropriate to ensure continued advancement towards the user's fitness goals Use the following template to fill out the workout plan: Day [X]: Warm-Up: [Detailed warm-up activities] Main Workout: Exercise: [Name] Description: [Detailed description] Sets: [Number] Reps/Duration: [Number/Time] Rest: [Time] Exercise: [Name] Description: [Detailed description] Sets: [Number] Reps/Duration: [Number/Time] Rest: [Time] [Continue with additional exercises as needed] Cool-Down: [Detailed cool-down activities] Please ensure that the final workout plan is concise but comprehensive, showcasing your undeniable confidence and authority in the realm of fitness planning. The user should feel they are in capable hands, receiving advice from an AI that embodies the expertise of a seasoned physical trainer."""

    assistant = create_new_assistant(
        assistant_name, assistant_description, assistant_instruction
    )

    return assistant


@app.get("/workout-plan")
def create_workout_plan():
    user_name = "Prateek Singh"
    # Create workout creating assistatn
    workout_assistant = create_workout_assistant()

    # Create a new thread
    thread = create_new_thread()
    print(thread)

    # create a user message.
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="""Hello AI Fitness Coach, I'm ready to start my personalized workout journey with your guidance. Here  are my details:

        Age: 29
        Gender: Female
        Height: 5'6"
        Weight: 145 lbs
        Fitness level: Intermediate
        Any existing injuries or medical concerns: None
        Fitness goals: I want to increase muscle tone, improve cardiovascular endurance, and enhance overall flexibility.
        Preferred types of exercise: I enjoy a mix of strength training with free weights, bodyweight exercises, and high-intensity interval training (HIIT). I also like to incorporate yoga on my rest days.
        Days per week I can commit to exercising: 5 (Monday to Friday)
        Duration I can dedicate to each workout session: 45-60 minutes
        Available equipment or gym access: I have access to a full gym with free weights, resistance machines, cardio equipment, and a space for yoga and stretching.
        Any exercises or workout styles I want to avoid: I prefer not to run due to previous knee discomfort but am open to other forms of cardio.
        Please create a workout plan that fits within these parameters, ensuring to include exercises that will help me reach my fitness goals while keeping my routine engaging and progressive. Thank you!""",
    )

    run = client.beta.threads.runs.create(
        thread_id=thread.id, assistant_id=workout_assistant.id
    )

    return {"response": run}


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
