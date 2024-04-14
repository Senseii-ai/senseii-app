// this will contain the functions that can be used in the nutrition assistant

import OpenAI from "openai";
import { getNutritionAssistantId } from "./assistant";
import { FunctionDefinition } from "openai/resources";
import { IFunctionType } from "../functions";

// get the Nutrition Assistant Id from the env files
const NutritionAssistantId = getNutritionAssistantId();

// A general type containing arguments for all types of functions supported by nutrition assistant.
export type NutritionToolArguments = ICreateNutritionPlanArguments

interface IBasicInformation {
  age: number;
  weight: number;
  height: number;
  gender: string;
}

interface ILifeStyle {
  dailyRoutine: "sedenatry" | "light" | "moderate" | "heavy" | "very heavy";
  exerciseRoutine?: {
    exerciseType: "cardio" | "strength" | "flexibility" | "balance" | "none";
    frequency: "daily" | "weekly" | "monthly";
  };
}


interface IDietPreferences {
  preference:
  | "vegetarian"
  | "non-vegetarian"
  | "vegan"
  | "pescatarian"
  | "omnivore"
  | "ketogenic"
  | "paleo";
  allergies: string[];
  intolerances: string[];
  dislikedFood?: string[];
  favouriteFood?: string[];
}

interface IHealthGoals {
  weightGoal?: "gain" | "loss" | "maintain";
  specificNutritionGoal: string;
  medicalConditions: string[];
}

interface IEatingHabits {
  mealsPerDay: number;
  mealComplexity: "simple" | "moderate" | "complex";
  cookingTime:
  | "less than 30 minutes"
  | "30-60 minutes"
  | "more than 60 minutes";
}

interface IConstraints {
  financial: {
    budget: number;
    budgetType: "daily" | "weekly" | "monthly";
  };
  geographical: {
    location: string;
  };
}

// TODO: maybe move this into the model section.
// this interface is for saving the user preference in the database
interface IUserPreferences {
  type: "userPreferences"
  basicInformation: IBasicInformation;
  lifeStyle: ILifeStyle;
  dietPreferences: IDietPreferences;
  healthGoals: IHealthGoals;
  eatingHabits: IEatingHabits;
  constraints: IConstraints;
}

export interface hello {
  userName: string
}

// wrapper functoin.
export const CreateNutritionPlan = async (
  client: OpenAI,
  userPreferences: string,
  userGoal: string,
  threadId: string
) => {
  // pass
};

// this interface is for parsing the user preferences from the text using the core assistant.
export interface ICreateNutritionPlanArguments {
  type: "createNutritionPlan"
  basicInformation: IBasicInformation
  lifeStyle: ILifeStyle
  dietPreferences: IDietPreferences
  healthGoals: IHealthGoals
  eatingHabits: IEatingHabits
  constraints: IConstraints
}

// this function creates the nutrition plan for the user.
export const createNutritionPlan = async (
  basicInformation: IBasicInformation,
  lifeStyle: ILifeStyle,
  dietPreferences: IDietPreferences,
  healthGoals: IHealthGoals,
  eatingHabits: IEatingHabits,
  constraints: IConstraints
) => {
  // call the nutrition assistant to create the workout plan
};

// createNutritionPlanSchema returns the schema for the create nutrition plan function.
export const createNutritionPlanSchema = () => {
  const createNutritionPlanSchema: FunctionDefinition = {
    name: "create_nutrition_plan",
    description:
      `Creates a nutrition plan for the user when core assistant has all the necessary information needed to create the diet plan.
      List of information:
      - basicInformation: The basic information of the user which includes age [required], weight[required], height [required], gender [required].
      - lifestyle: The lifestyle of the user which includes daily routine and exercise routine [required], daily routine [optional].
      - dietPreferences: The diet preferences of the user which includes preferences [required], allergies [required], intolerances, disliked food, favourite food.
      - healthGoals: The health goals of the user which includes weight goal [required], specific nutrition goal [required], medical conditions [required].
      - eatingHabits: The eating habits of the user which includes meals per day [required], meal complexity [optional], cooking time [optional].
      - constraints: The constraints of the user which includes financial [required], geographical [optional].

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
  function: createNutritionPlan,
  funcitonDefinition: createNutritionPlanSchema,
  functionalityType: "Nutrition"
}
