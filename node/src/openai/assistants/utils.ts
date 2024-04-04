// this will contain utility functions for the senseii application

import chalk from "chalk";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import {
  getCoreAssistantFunctionNames,
  getCoreAssistantTools,
} from "./core/assistant";
import { getOpenAIClient } from "../client";
import { IFunctionType } from "./functions";
import { ICreateNutritionPlanArguments } from "./nutrition/functions";

// parameter parser.
// TODO: locally store the functions supported by each assistant.
// TODO: implement Function argument interface and type for each assistant.
// TODO: implement the parsing function of each assistant tool
const client = getOpenAIClient();

// parseFunctionArguments parses the function arguments based on the function definition.
export const parseFunctionArguments = async (
  functionArguments: string,
  functionDefinition: IFunctionType
) => {
  try {
    switch (functionDefinition.name) {
      case "createNutritionPlan":
        const parsedData = JSON.parse(functionArguments);
        const parsedFunctionArguments: ICreateNutritionPlanArguments = {
          type: "createNutritionPlan",
          basicInformation: parsedData.basicInformation,
          lifeStyle: parsedData.lifeStyle,
          dietPreferences: parsedData.dietPreferences,
          healthGoals: parsedData.healthGoals,
          eatingHabits: parsedData.eatingHabits,
          constraints: parsedData.constraints,
        };
        return parsedFunctionArguments;
    }
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};