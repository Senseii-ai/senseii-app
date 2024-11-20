import { createGoal } from "./core/core.functions";
import { createNutritionPlanFunction } from "./nutrition/nutrition.functions";

// each function will have these three properties
export interface IFunctionType {
  name: string;
  function: (args: any) => Promise<string>;
  funcitonDefinition: Function;
  functionalityType: "Nutrition" | "Core" | "Fitness";
}

export const supportedFunctions: Record<string, IFunctionType> = {
  create_nutrition_plan: createNutritionPlanFunction,
  // create_goal: createGoal
};
