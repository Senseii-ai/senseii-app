// this will contain the functions that can be used in the nutrition assistant
import { getNutritionAssistant } from "./assistant";
import { FunctionDefinition } from "openai/resources";
import { IFunctionType } from "../functions";
import chalk from "chalk";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { createRun } from "../run";
import { getOpenAIClient } from "../../client";
import { getNewThreadWithMessages } from "../threads";
import { MessageCreateParams } from "openai/resources/beta/threads/messages/messages";
import { ICreateNutritionPlanArguments } from "../../../types/user/nutritionPlan";
import { StringToJson } from "./utils/utils";

// A general type containing arguments for all types of functions supported by nutrition assistant.
export type NutritionToolArguments = ICreateNutritionPlanArguments;
const openAIClient = getOpenAIClient();

/**
 * TODO: You get the following information here
 * height: IBodyMeasurement
 *
 */
// wrapper function.
export const CreateNutritionPlan = async (
  functionArguments: ICreateNutritionPlanArguments,
): Promise<string> => {
  try {
    const client = getOpenAIClient();
    const nutritionAssistant = await getNutritionAssistant(client);
    let output: string = "";
    const response = await createNutritionPlan(
      nutritionAssistant,
      functionArguments,
    );
    if (response && response[0].content[0].type === "text") {
      output = response[0].content[0].text.value;
    }
    console.log(chalk.green("This is the output", JSON.stringify(output)));

    // save it into the database and return to the user the response
    const jsonObject = StringToJson(output)
    return output;
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

// this function creates the nutrition plan for the user.
export const createNutritionPlan = async (
  assistant: Assistant,
  funcArguments: ICreateNutritionPlanArguments,
) => {
  // TODO: look into validating the data before moving ahead.
  // TODO: Also look into storing the information in database related to the user.

  try {
    const userInformation = JSON.stringify(funcArguments);
    const prompt = `Create Nutrition Plan for this user with following preferences. ${userInformation}`;

    // create thread, run it and then delete it later.
    const message: MessageCreateParams = {
      role: "user",
      content: prompt,
    };
    const newThreadId = await getNewThreadWithMessages(message, openAIClient);
    const response = await createRun(newThreadId, openAIClient, assistant.id);
    return response;
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

// createNutritionPlanSchema returns the schema for the create nutrition plan function.
export const createNutritionPlanSchema = () => {
  const createNutritionPlanSchema: FunctionDefinition = {
    name: "create_nutrition_plan",
    description: `Creates a nutrition plan for the user when core assistant has all the necessary information needed to create the diet plan.
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
  function: CreateNutritionPlan,
  funcitonDefinition: createNutritionPlanSchema,
  functionalityType: "Nutrition",
};
