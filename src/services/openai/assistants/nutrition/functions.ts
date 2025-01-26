import { FunctionDefinition } from "openai/resources";
import chalk from "chalk";
import { NutritionPlan, nutritionPlanObject, userPreferencesValidatorObject, ICreateNutritionPlanArguments } from "@senseii/types";
import { CREATE_NUTRITION_FUNC } from "@services/openai/assistants/core/constants";
import { getNutritionSystemPrompt } from "@services/openai/assistants/nutrition/constants";
import { chatComplete } from "@services/openai/utils";
import { getValidArguments } from "@services/openai/assistants/core";

export type NutritionToolArguments = ICreateNutritionPlanArguments;

// FIX: make this fail proof, so remove try catch.
export const createNutritionPlan = async (
  args: string,
): Promise<NutritionPlan> => {
  try {
    // FIX: We can get all this information directly from DB, instead generating them from o1 mini.
    const validArgs = await getValidArguments({ data: args, validatorSchema: userPreferencesValidatorObject, validatorSchemaName: "create-nutrition-plan" })
    console.log("validArgs", validArgs)
    const response: NutritionPlan = await chatComplete({ prompt: JSON.stringify(validArgs), systemPrompt: getNutritionSystemPrompt("Monday"), validatorSchemaName: "create-nutrition-plan", validatorSchema: nutritionPlanObject })
    return response
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


