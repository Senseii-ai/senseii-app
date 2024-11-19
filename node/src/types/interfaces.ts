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

export const nutritionPlanValidatorSchema = z.object({
  type: z.literal("nutritionPlan"),
  nutritionPlan
})

export type NutritionPlan = z.infer<typeof nutritionPlanValidatorSchema>

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

const testMealPlan: INutritionPlan = {
  plan: [
    {
      day: "Monday",
      meals: [
        {
          type: "Breakfast",
          food: "Oats with milk and banana",
          macros: { protein: 20, dietryFat: 8, carbohydrates: 52, water: 250 },
          micros: { vitamins: 90, dietryMinerals: 120 },
          calories: 380,
          items: [
            { item: "Oats", proportion: 50, unit: "grams" },
            { item: "Milk", proportion: 200, unit: "grams" },
            { item: "Banana", proportion: 1, unit: "count" },
          ],
        },
        {
          type: "Lunch",
          food: "Grilled chicken with quinoa and mixed vegetables",
          macros: { protein: 35, dietryFat: 10, carbohydrates: 40, water: 300 },
          micros: { vitamins: 120, dietryMinerals: 150 },
          calories: 500,
          items: [
            { item: "Chicken", proportion: 100, unit: "grams" },
            { item: "Quinoa", proportion: 50, unit: "grams" },
            { item: "Mixed Vegetables", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Fish curry with brown rice",
          macros: { protein: 30, dietryFat: 12, carbohydrates: 55, water: 300 },
          micros: { vitamins: 110, dietryMinerals: 130 },
          calories: 550,
          items: [
            { item: "Fish", proportion: 100, unit: "grams" },
            { item: "Brown Rice", proportion: 60, unit: "grams" },
          ],
        },
      ],
    },
    {
      day: "Tuesday",
      meals: [
        {
          type: "Breakfast",
          food: "Greek yogurt with honey and berries",
          macros: { protein: 25, dietryFat: 7, carbohydrates: 45, water: 200 },
          micros: { vitamins: 100, dietryMinerals: 150 },
          calories: 320,
          items: [
            { item: "Greek Yogurt", proportion: 200, unit: "grams" },
            { item: "Honey", proportion: 20, unit: "grams" },
            { item: "Berries", proportion: 50, unit: "grams" },
          ],
        },
        {
          type: "Lunch",
          food: "Paneer tikka with whole wheat roti and green salad",
          macros: { protein: 26, dietryFat: 14, carbohydrates: 50, water: 250 },
          micros: { vitamins: 90, dietryMinerals: 140 },
          calories: 450,
          items: [
            { item: "Paneer", proportion: 100, unit: "grams" },
            { item: "Whole Wheat Roti", proportion: 2, unit: "count" },
            { item: "Green Salad", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Chicken stew with vegetables",
          macros: { protein: 29, dietryFat: 10, carbohydrates: 40, water: 300 },
          micros: { vitamins: 120, dietryMinerals: 150 },
          calories: 480,
          items: [
            { item: "Chicken", proportion: 100, unit: "grams" },
            { item: "Vegetables", proportion: 150, unit: "grams" },
          ],
        },
      ],
    },
    {
      day: "Wednesday",
      meals: [
        {
          type: "Breakfast",
          food: "Scrambled eggs with spinach and whole grain toast",
          macros: { protein: 21, dietryFat: 10, carbohydrates: 35, water: 250 },
          micros: { vitamins: 105, dietryMinerals: 140 },
          calories: 340,
          items: [
            { item: "Eggs", proportion: 3, unit: "count" },
            { item: "Spinach", proportion: 50, unit: "grams" },
            { item: "Whole Grain Toast", proportion: 2, unit: "count" },
          ],
        },
        {
          type: "Lunch",
          food: "Lentil soup with brown rice and a side of roasted vegetables",
          macros: { protein: 22, dietryFat: 8, carbohydrates: 55, water: 300 },
          micros: { vitamins: 125, dietryMinerals: 160 },
          calories: 460,
          items: [
            { item: "Lentil Soup", proportion: 200, unit: "grams" },
            { item: "Brown Rice", proportion: 60, unit: "grams" },
            { item: "Roasted Vegetables", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Grilled shrimp with couscous and steamed broccoli",
          macros: { protein: 28, dietryFat: 9, carbohydrates: 50, water: 300 },
          micros: { vitamins: 110, dietryMinerals: 150 },
          calories: 470,
          items: [
            { item: "Shrimp", proportion: 100, unit: "grams" },
            { item: "Couscous", proportion: 50, unit: "grams" },
            { item: "Broccoli", proportion: 50, unit: "grams" },
          ],
        },
      ],
    },
    {
      day: "Thursday",
      meals: [
        {
          type: "Breakfast",
          food: "Smoothie with spinach, banana, and protein powder",
          macros: { protein: 22, dietryFat: 6, carbohydrates: 45, water: 300 },
          micros: { vitamins: 130, dietryMinerals: 160 },
          calories: 320,
          items: [
            { item: "Spinach", proportion: 50, unit: "grams" },
            { item: "Banana", proportion: 1, unit: "count" },
            { item: "Protein Powder", proportion: 30, unit: "grams" },
          ],
        },
        {
          type: "Lunch",
          food: "Chicken tikka with brown rice and mixed salad",
          macros: { protein: 35, dietryFat: 12, carbohydrates: 55, water: 300 },
          micros: { vitamins: 115, dietryMinerals: 150 },
          calories: 500,
          items: [
            { item: "Chicken", proportion: 100, unit: "grams" },
            { item: "Brown Rice", proportion: 60, unit: "grams" },
            { item: "Mixed Salad", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Chickpea curry with quinoa and steamed vegetables",
          macros: { protein: 20, dietryFat: 10, carbohydrates: 60, water: 300 },
          micros: { vitamins: 140, dietryMinerals: 170 },
          calories: 460,
          items: [
            { item: "Chickpea", proportion: 150, unit: "grams" },
            { item: "Quinoa", proportion: 50, unit: "grams" },
            { item: "Steamed Vegetables", proportion: 100, unit: "grams" },
          ],
        },
      ],
    },
    {
      day: "Friday",
      meals: [
        {
          type: "Breakfast",
          food: "Idli with sambar",
          macros: { protein: 18, dietryFat: 6, carbohydrates: 55, water: 200 },
          micros: { vitamins: 125, dietryMinerals: 140 },
          calories: 300,
          items: [
            { item: "Idli", proportion: 3, unit: "count" },
            { item: "Sambar", proportion: 150, unit: "grams" },
          ],
        },
        {
          type: "Lunch",
          food: "Fish curry with quinoa and steamed vegetables",
          macros: { protein: 30, dietryFat: 10, carbohydrates: 60, water: 300 },
          micros: { vitamins: 140, dietryMinerals: 150 },
          calories: 500,
          items: [
            { item: "Fish", proportion: 100, unit: "grams" },
            { item: "Quinoa", proportion: 50, unit: "grams" },
            { item: "Steamed Vegetables", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Chicken curry with whole grain paratha",
          macros: { protein: 35, dietryFat: 12, carbohydrates: 55, water: 300 },
          micros: { vitamins: 120, dietryMinerals: 160 },
          calories: 480,
          items: [
            { item: "Chicken", proportion: 100, unit: "grams" },
            { item: "Whole Grain Paratha", proportion: 2, unit: "count" },
          ],
        },
      ],
    },
    {
      day: "Saturday",
      meals: [
        {
          type: "Breakfast",
          food: "Poha with peas and potatoes",
          macros: { protein: 15, dietryFat: 7, carbohydrates: 50, water: 200 },
          micros: { vitamins: 130, dietryMinerals: 140 },
          calories: 320,
          items: [
            { item: "Poha", proportion: 100, unit: "grams" },
            { item: "Peas", proportion: 50, unit: "grams" },
            { item: "Potatoes", proportion: 50, unit: "grams" },
          ],
        },
        {
          type: "Lunch",
          food: "Grilled chicken sandwich with avocado and cucumber salad",
          macros: { protein: 30, dietryFat: 15, carbohydrates: 45, water: 300 },
          micros: { vitamins: 115, dietryMinerals: 150 },
          calories: 460,
          items: [
            { item: "Chicken", proportion: 100, unit: "grams" },
            { item: "Avocado", proportion: 50, unit: "grams" },
            { item: "Cucumber Salad", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Egg curry with brown rice",
          macros: { protein: 25, dietryFat: 10, carbohydrates: 55, water: 300 },
          micros: { vitamins: 130, dietryMinerals: 160 },
          calories: 480,
          items: [
            { item: "Egg", proportion: 3, unit: "count" },
            { item: "Brown Rice", proportion: 60, unit: "grams" },
          ],
        },
      ],
    },
    {
      day: "Sunday",
      meals: [
        {
          type: "Breakfast",
          food: "Whole grain pancakes with fresh fruit and honey",
          macros: { protein: 20, dietryFat: 8, carbohydrates: 55, water: 250 },
          micros: { vitamins: 130, dietryMinerals: 150 },
          calories: 400,
          items: [
            { item: "Whole Grain Pancake", proportion: 3, unit: "count" },
            { item: "Fresh Fruit", proportion: 100, unit: "grams" },
            { item: "Honey", proportion: 20, unit: "grams" },
          ],
        },
        {
          type: "Lunch",
          food: "Dal makhani with brown rice and mixed vegetables",
          macros: { protein: 22, dietryFat: 10, carbohydrates: 50, water: 300 },
          micros: { vitamins: 120, dietryMinerals: 150 },
          calories: 450,
          items: [
            { item: "Dal Makhani", proportion: 200, unit: "grams" },
            { item: "Brown Rice", proportion: 60, unit: "grams" },
            { item: "Mixed Vegetables", proportion: 100, unit: "grams" },
          ],
        },
        {
          type: "Dinner",
          food: "Tofu stir fry with quinoa",
          macros: { protein: 24, dietryFat: 10, carbohydrates: 50, water: 300 },
          micros: { vitamins: 140, dietryMinerals: 170 },
          calories: 440,
          items: [
            { item: "Tofu", proportion: 100, unit: "grams" },
            { item: "Quinoa", proportion: 70, unit: "grams" },
          ],
        },
      ],
    },
  ],
};

// const testMealPlanTwo : INutritionPlan =
