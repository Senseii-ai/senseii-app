import { FunctionDefinition } from "openai/resources";
import chalk from "chalk";
import { NutritionPlan, nutritionPlanObject, userPreferencesValidatorObject, ICreateNutritionPlanArguments } from "@senseii/types";
import { CREATE_NUTRITION_FUNC } from "@services/openai/assistants/core/constants";
import { NutritionSystemPrompt } from "@services/openai/assistants/nutrition/constants";
import { chatComplete } from "@services/openai/utils";
import { getValidArguments } from "@services/openai/assistants/core";

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


