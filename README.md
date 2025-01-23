# Senseii

> Senseii is the Jarvis who specialises in taking care of your health and lifestyle,

Senseii democratizes Healthcare and Lifestyle. It is a group of AI agents, working
together to guide the users, helping them lead a healthy Life. Each assistant is
an expert in a domain like Nutrition, Workouts, Human Anatomy etc. The system knows
about the user, their needs, preferences, past interactions and based on that, it
generates plans for the user to follow, tracks their progress in real-time through
gamification. Eventually leading to a healthier lifestyle without the hassle.

## Why am I building this

Every human deserves to lead a healthy life. Eating the right thing, at the right
time, in the right proportion. Similarly, optimal amount of body movement through
exercises, Yoga etc. Sleep and recovery is another big factor.

It is also the responsibility of every human to also be aware of how their body works,
and why they are supposed to eat something and avoid the other, do a workout,
and avoid the other.

This is not currently viable to a huge population of the people, there are a few
major reasons for it.

- Lack of domain specific knowledge.
- Not enough professionals to provider personalised care to each individual.
- Lack of Financial resources (Human resources are costly).

Due to these blockers, people take their own health for granted, but things are
changing, the newer generation is taking care of themselves more and Senseii enables
them.

## The Plan

The Plan keeps changing, but this is the current flow I think would work since it
is **upwind**.

> Taking _staying upwind_ from Paul Graham's essay [How to do Great work](https://paulgraham.com/greatwork.html)
> Performance of LLMs will improve, we will have better abstractions, larger context
> lengths, LLMs won't be a black box forever. This approach relies on all these factors
> and ensures that overall performance of the system will be better as LLMs improve.

## The Architecture

There are multiple agents in the system, for the MVP I am focusing on specific use-cases
that includes.

- Loosing Weight
- Gaining Muscles
- Better Cardio Health

Which encompasses a huge portion of the target audience. Therefore the system will
have three assistants.

- **Core Assistant**: Orchestrator of the system, directly interacting with the user,
  gathering relevant information, understanding their intent and triggering
  other assistants to do their work.
- **Nutrition Assistant**: For generating Personalised Nutrition Plans (and altering
  them).
- **Workout Assistant**: For generating Personalised Workout Plans (and altering
  them).

These assistants will be interacting with each other using **function calling** and
their responses will be **structured**, following a specific _zod_ schema, so things
can be directly saved into the database for persistence, enabling future interactions.

## The Process

The solution currently relies on a four step process:

- Gathering relevant information through natural language (good UX).
- Explaining the first time users their current physical state and calculate relevant
  information like BMI, BMR, TDEE macro/micro targets etc. Hence educating them.
- Generating Plans in parallel using domain expert models.
- Once accepted by the user, **_Tracking Process Starts_**

### Tracking process

TO BE DOCUMENTED...

## Tech Stack (Backend)

Currently the Back-end is built using

- Node JS
- Express
- MongoDB
- OpenAI SDK
