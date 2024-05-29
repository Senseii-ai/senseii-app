export interface INutritionPlan {
  plan: IDailyNutritionPlan[];
}

export interface IDailyNutritionPlan {
  day: Weekday;
  meals: IMeals[];
}

export interface IItems {
  item: string;
  proportion: number;
  unit: "grams" | "kilograms" | "count";
}

export interface IMacroNutrients {
  protein: number;
  dietryFat: number;
  carbohydrates: number;
  water: number;
}

export interface IMicroNutrients {
  vitamins: number;
  dietryMinerals: number;
}

export interface IMeals {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  food: String;
  macros: IMacroNutrients;
  micros: IMicroNutrients;
  calories: number;
  items: IItems[];
}

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
