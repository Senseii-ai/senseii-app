import { FunctionDefinition } from "openai/resources";
import { getNutritionAssistant } from "./nutrition.assistant";
import { IFunctionType } from "../functions";
import chalk from "chalk";
import { Assistant } from "openai/resources/beta/assistants";
import { createRun } from "../run";
import { getOpenAIClient } from "../../openai.client";
import { getNewThreadWithMessages } from "../threads";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";
import { ICreateNutritionPlanArguments } from "../../../../types/user/nutritionPlan";
import { nutritionPlanObject as nutritionPlanValidatorSchema } from "../../../../types/interfaces";

// A general type containing arguments for all types of functions supported by nutrition assistant.
export type NutritionToolArguments = ICreateNutritionPlanArguments;
const client = getOpenAIClient();

// export const CompleteNutritionPlan = async () => {
//   try {
//     const prompt = `No more changes needed, complete the remaining plan and generate the remaining plan`
//     const nutritionAssistant = await getNutritionAssistant(client);
//     const threadId = "hello"
//     // const getNutritionThreadIdForGoal = 
//     // console.log("MODEL RESPONSE", finalPlan)
//     const finalPlan = chatComplete(prompt, threadId, nutritionAssistant)
//     const parsedData = nutritionPlanValidatorSchema.parse(finalPlan)
//     console.log("PARSED DATA", parsedData)
//   } catch (error) {
//
//   }
// }
//
// // UpdateNutritionPlan updates the nutrition plan as per user's needs.
// export const UpdateNutritionPlan = async () => {
//   try {
//     const prompt = ``
//   } catch (error) {
//
//   }
// }

export const CreateInitialPlan = async (
  functionArguments: ICreateNutritionPlanArguments,
): Promise<string> => {
  try {
    const client = getOpenAIClient();
    const nutritionAssistant = await getNutritionAssistant(client);
    const plan = await createNutritionPlan(
      nutritionAssistant,
      functionArguments,
    );
    // TODO: Save user's Nutrition Plan in the database.
    // console.log("BEFORE PARSED:", output)
    // const parsedPlan = nutritionPlanValidatorSchema.parse(output)
    // console.log("PARSED", parsedPlan)
    return JSON.stringify(plan);
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

const chatComplete = async (prompt: string, threadId: string | null, assistant: Assistant) => {
  try {
    // create thread, run it and then delete it later.
    const message: MessageCreateParams = {
      role: "user",
      content: prompt,
    };
    if (threadId === null) {
      threadId = await getNewThreadWithMessages(message, client);
    }
    const response = await createRun(threadId, client, assistant.id);
    let output = ""
    if (response && response[0].content[0].type === "text") {
      output = response[0].content[0].text.value;
    }
    return output;
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
}



// this function creates the nutrition plan for the user.
export const createNutritionPlan = async (
  assistant: Assistant,
  funcArguments: ICreateNutritionPlanArguments,
) => {
  try {
    const userInformation = JSON.stringify(funcArguments);
    // TODO: Validate the userInformation object
    const prompt = `Create First three weekdays plan for this user with following preferences. ${userInformation}`;

    // create thread, run it and then delete it later.
    const message: MessageCreateParams = {
      role: "user",
      content: prompt,
    };
    const newThreadId = await getNewThreadWithMessages(message, client);
    const response = await createRun(newThreadId, client, assistant.id);
    let output = ""
    if (response && response[0].content[0].type === "text") {
      output = response[0].content[0].text.value;
    }
    console.log("MODEL RESPONSE", output)
    const parsedData = nutritionPlanValidatorSchema.parse(output)
    console.log("PARSED DATA", parsedData)
    return parsedData;
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

// TODO: Move to constants
// createNutritionPlanSchema returns the schema for the create nutrition plan function.
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
