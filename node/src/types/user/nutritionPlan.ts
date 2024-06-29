import { IBasicInformation, ILifeStyle, IDietPreferences, IHealthGoals, IEatingHabits, IConstraints } from "./userPreferences";

export interface ICreateNutritionPlanArguments {
  type: "createNutritionPlan";
  basicInformation: IBasicInformation;
  lifeStyle: ILifeStyle;
  dietPreferences: IDietPreferences;
  healthGoals: IHealthGoals;
  eatingHabits: IEatingHabits;
  constraints: IConstraints;
}
