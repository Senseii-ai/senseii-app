import { FunctionDefinition } from "openai/resources";
import { IFunctionType } from "../functions";
import chalk from "chalk";
import { Assistant } from "openai/resources/beta/assistants";
import { createRun } from "../run";
import { getOpenAIClient } from "../../openai.client";
import { getNewThreadWithMessages } from "../threads";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";
import { ICreateNutritionPlanArguments } from "../../../../types/user/nutritionPlan";
import { nutritionPlanObject, nutritionPlanObject as nutritionPlanValidatorSchema } from "../../../../types/interfaces";
import { userPreferencesValidatorObject } from "../../../../types/user/userPreferences";
import { zodResponseFormat } from "openai/helpers/zod";
import { CREATE_NUTRITION_FUNC } from "../core/constants";

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
  functionArguments: string,
): Promise<string> => {
  try {
    const plan = await createNutritionPlan(
      // nutritionAssistant,
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

// createNutritionPlan creates a nutritoin plan for the using chat completions.
export const createNutritionPlan = async (
  // assistant: Assistant,
  funcArguments: string,
) => {
  try {
    const validatedArguments = userPreferencesValidatorObject.parse(JSON.parse(funcArguments))
    const prompt = `Create Nutrition plan for this user with following preferences. ${JSON.stringify(validatedArguments)}`;
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o-2",
      response_format: zodResponseFormat(nutritionPlanObject, "diet-plan-creation"),
      messages: [
        {
          role: "system",
          content: `As an AI nutrition expert, confidently and expertly craft individual meal
            plans tailored to a user's dietary preferences, health goals, lifestyle
            requirements. With your extensive knowledge in dietary science and nutritional
            needs, you will create dynamic and adaptive meal guides.

            The plan should contain what meal user has to eat, each day, for 7 days a week.
            be sure to keep the user's needs and requirements to keep in mind.

            Things to keep in mind:
            - don't make assumptions.
            - create response in json format
            - keep religious beliefs in mind while creating plans
            - use very less words
            - write plan for each day
            - Start with explaining what the user needs depending on their personal
              information, things including but not limited to Macro and micro requirements
            - Then explain why do they want it ? so that they are a bit educated too.
              example including but not limited to, 1.5x grams of protein per kg of body weight.
            - Finally create the plan, that definitely includes but not limited to:
                - Macro and micro per meal, and total per day.
                - proportions, in gram, ml etc. depending on what type of food item it is.`
        },
        { role: "user", content: prompt }
      ]
    })
    const output = completion.choices[0].message.parsed
    const parsedData = nutritionPlanValidatorSchema.parse(output)
    return parsedData;
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

// createNutritionPlanSchema returns the schema for the create nutrition plan function.
export const createNutritionPlanSchema = () => {
  const createNutritionPlanSchema: FunctionDefinition = CREATE_NUTRITION_FUNC.function
  return createNutritionPlanSchema;
};

export const createNutritionPlanFunction: IFunctionType = {
  name: "createNutritionPlan",
  function: CreateInitialPlan,
  funcitonDefinition: createNutritionPlanSchema,
  functionalityType: "Nutrition",
};
