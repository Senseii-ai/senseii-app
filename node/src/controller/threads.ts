import { getOpenAIClient } from "../services/openai/openai.client";
import {
  getNewEmptyThread,
  retrieveMessages,
} from "../services/openai/assistants/threads";
import { IAuthRequest } from "../middlewares/auth";
import { Response } from "express";
import { getUserThreads } from "../models/userInfo";
import { MessagesPage } from "openai/resources/beta/threads/messages";
import { FunctionDefinition } from "openai/resources";
import { CreateInitialPlan } from "../services/openai/assistants/nutrition/nutrition.functions";
import { IFunctionType } from "../services/openai/assistants/functions";

const client = getOpenAIClient();

// createEmptyThread creates a new thread and returns the thread object.
export const createEmptyThread = async (req: IAuthRequest, res: Response) => {
  const response = await getNewEmptyThread(client);
  return res.status(200).json(response.id);
};

// getThreadMessages retruns a list of all the messages
export const getThreadMessaegs = async (req: IAuthRequest, res: Response) => {
  try {
    const threadId = req.params.id;
    const response: MessagesPage = await retrieveMessages(threadId, client);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting thread messages", error);
    res.status(501).json({ message: "Internal server error" });
  }
};

export const getThreads = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params;
    const threads = await getUserThreads(userId.id);
    if (threads === undefined) {
      return res.status(200).json([]);
    }
    return res.status(200).json(threads);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error getting user threads" });
  }
};

export const createNutritionPlanSchema = () => {
  const createNutritionPlanSchema: FunctionDefinition = {
    name: "create_nutrition_plan",
    description: `Creates a nutrition plan for the user when core assistant has all the necessary information needed to create the diet plan.
[req] means required List of information:
      - basicInformation: basic user information includes age [req], weight[req], height [req], gender [req].
      - lifestyle: user lifestyle information which includes daily routine and exercise routine [req], daily routine [optional].
      - dietPreferences: user diet preference which includes preferences [req], allergies [req], intolerances, disliked food, favourite food.
      - healthGoals: user health goals which includes weight goal [req], specific nutrition goal [req], medical conditions [req].
      - eatingHabits: user eating habits which includes meals per day [req], meal complexity [optional], cooking time [optional].
      - constraints: user constraints which includes financial [req], geographical [optional].

      The diet plan is created based on the information provided by the user.
      `,
    parameters: {
      type: "object",
      properties: {
        basicInformation: {
          type: "object",
          peroperteis: {
            age: { type: "number", description: "age of the user" },
            weight: { type: "number", description: "weight of the user" },
            height: { type: "number", description: "height of the user" },
            gender: { type: "string", description: "gender of the user" },
          },
          lifeStyle: {
            type: "object",
            dailyRoutine: {
              type: "string",
              description: `
                        The daily routine of the user which includes:
                        - sedentary
                        - light
                        - moderate
                        - heavy
                        - very heavy
                        `,
            },
            exerciseRoutine: {
              type: "object",
              properties: {
                exerciseType: {
                  type: "string",
                  description:
                    "The type of exercise that the user does, which can be of type 'cardio', 'strength', 'flexibility', 'balance', 'none'",
                },
                frequency: {
                  type: "string",
                  description:
                    "The frequency of the exercise that the user does, which can be of type 'daily', 'weekly', 'monthly'",
                },
              },
            },
          },
          dietPreferences: {
            type: "object",
            properties: {
              preference: {
                type: "string",
                description:
                  "The user's diet preference, which can be of type 'vegetarian', 'non-vegetarian', 'vegan', 'pescatarian', 'omnivore', 'ketogenic', 'paleo' ",
              },
              allergies: {
                type: "array",
                items: { type: "string" },
                description: "an array of all the allergies that the user has",
              },
              intolerances: {
                type: "array",
                items: { type: "string" },
                description:
                  "an array of all the intolerances that the user has",
              },
              dislikedFood: {
                type: "array",
                items: { type: "string" },
                description: "an arryay of all the food that the user dislikes",
              },
              favouriteFood: {
                type: "array",
                items: { type: "string" },
                description: "an array of all the food that the user likes",
              },
            },
          },
          healthGoals: {
            type: "object",
            properties: {
              weightGoal: {
                type: "string",
                description:
                  "The user's weight goal, which can be of type 'gain', 'loss', 'maintain' ",
              },
              specificNutritionGoal: {
                type: "string",
                description: "The user's specific nutrition goal",
              },
              medicalConditions: {
                type: "array",
                items: { type: "string" },
                description:
                  "an array of all the medical conditions that the user has",
              },
            },
          },
          eatingHabits: {
            type: "object",
            properties: {
              mealsPerDay: {
                type: "number",
                description: "The number of meals that the user has per day",
              },
              mealComplexity: {
                type: "string",
                description:
                  "The complexity of the meals that the user has, which can be of type 'simple', 'moderate', 'complex' ",
              },
              cookingTime: {
                type: "string",
                description:
                  "The cooking time of the user, which can be of type 'less than 30 minutes', '30-60 minutes', 'more than 60 minutes' ",
              },
            },
          },
          constraints: {
            type: "object",
            properties: {
              financial: {
                type: "object",
                properties: {
                  budget: { type: "number", description: "The user's budget" },
                  budgetType: {
                    type: "string",
                    description:
                      "The type of the user's budget, which can be of type 'daily', 'weekly', 'monthly' ",
                  },
                },
              },
              geographical: {
                type: "object",
                properties: {
                  location: {
                    type: "string",
                    description:
                      "The user's location so that food specific to that location can be added in the plan",
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return createNutritionPlanSchema;
};

// TODO: create a function variable for every function supported by the Nutrition Assistant
export const createNutritionPlanFunction: IFunctionType = {
  name: "createNutritionPlan",
  function: CreateInitialPlan,
  funcitonDefinition: createNutritionPlanSchema,
  functionalityType: "Nutrition",
};
