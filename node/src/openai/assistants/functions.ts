// list of all the supported functions in the application

import { createNutritionPlanFunction } from "./nutrition/functions";

// each function will have these three properties
export interface IFunctionType {
  name: string;
  // TODO: make it more typesafe
  function: (args: any) => Promise<string>;
  funcitonDefinition: Function;
  functionalityType: "Nutrition" | "Core" | "Fitness";
}

// Record of all the supported functions in the system.
const supportedFunctions: Record<string, IFunctionType> = {
  create_nutrition_plan: createNutritionPlanFunction,
};

export const getSupportedFunctions = () => {
  return supportedFunctions;
};
