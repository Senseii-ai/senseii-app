import { z } from "zod"

const macroNutrients = z.object({
  protein: z.number(),
  dietryFat: z.number(),
  carbohydrates: z.number(),
  water: z.number()
})

const microNutrients = z.object({
  vitamins: z.number(),
  dietryMinerals: z.number()
})

const items = z.object({
  item: z.string(),
  proportion: z.number(),
  unit: z.enum(["grams", "kilograms", "count"])
})

const meals = z.object({
  type: z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"]),
  food: z.string(),
  macros: macroNutrients,
  micros: microNutrients,
  calories: z.number(),
  items: z.array(items)
})

const dailyNutritionPlan = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  meals: z.array(meals)
})

const nutritionPlan = z.object({
  plan: z.array(dailyNutritionPlan)
})

export const nutritionPlanObject = z.object({
  type: z.literal("nutritionPlan"),
  nutritionPlan
})

export type NutritionPlan = z.infer<typeof nutritionPlanObject>

// TODO: Replace with Zod entirely
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

