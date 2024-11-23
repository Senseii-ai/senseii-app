import { FunctionDefinition } from "openai/resources";
import chalk from "chalk";
import { ICreateNutritionPlanArguments } from "../../../../types/user/nutritionPlan";
import { NutritionPlan, nutritionPlanObject } from "../../../../types/interfaces";
import { userPreferencesValidatorObject } from "../../../../types/user/userPreferences";
import { CREATE_NUTRITION_FUNC } from "../core/constants";
import { chatComplete, validateResponse } from "../utils";
import { NutritionSystemPrompt } from "./constants";
import { getValidArguments } from "../core/core.functions";

export type NutritionToolArguments = ICreateNutritionPlanArguments;

export const createNutritionPlan = async (
  args: string,
): Promise<NutritionPlan> => {
  try {
    const validArgs = await getValidArguments({ data: args, validatorSchema: userPreferencesValidatorObject, validatorSchemaName: "create-nutrition-plan" })
    const response = await chatComplete({ prompt: JSON.stringify(validArgs), systemPrompt: NutritionSystemPrompt, validatorSchemaName: "create-nutrition-plan", validatorSchema: nutritionPlanObject })
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


