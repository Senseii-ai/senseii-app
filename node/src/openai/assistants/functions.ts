// list of all the supported functions in the application

import { createNutritionPlanFunction, } from "./nutrition/functions";

// each function will have these three properties
export interface IFunctionType {
  name: string
  function: Function
  funcitonDefinition: Function
  functionalityType: "Nutrition" | "Core" | "Fitness"
}

// Record of all the supported functions in the system.
const supportedFunctions: Record<string, IFunctionType> = {
  "createNutritionPlan": createNutritionPlanFunction
}

export const getSupportedFunctions = () => {
  return supportedFunctions
}
