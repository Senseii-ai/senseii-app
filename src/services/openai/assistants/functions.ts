import { CreateDietPlanFunc, CreateInitialGoalFunc, UpdateDietPreferencesFunc, UpdateEatingHabitsFunc, UpdateUserBasicInfoFunc, UpdateUserConstraintsFunc } from "@services/openai/assistants/core";

// each function will have these three properties
export interface IFunctionType {
  name: string;
  function: (args: any) => Promise<string>;
  functionalityType: "NUTRITION" | "CORE" | "FITNESS";
}

export const supportedFunctions: Record<string, IFunctionType> = {
  create_nutrition_plan: CreateDietPlanFunc,
  update_user_basic_information: UpdateUserBasicInfoFunc,
  update_eating_habits: UpdateEatingHabitsFunc,
  update_user_diet_preferences: UpdateDietPreferencesFunc,
  update_user_constraints: UpdateUserConstraintsFunc,
  create_initial_goal: CreateInitialGoalFunc,
};
