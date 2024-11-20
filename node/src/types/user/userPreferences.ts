import { Schema } from "mongoose";
import { z } from "zod"

const basicInformation = z.object({
  age: z.number(),
  weight: z.object({
    value: z.number(),
    unit: z.enum(["Kilograms", "Grams", "Pounds"])
  }),
  height: z.object({
    value: z.number(),
    unit: z.enum(["Centimeters"])
  }),
  gender: z.string()
})

const lifeStyle = z.object({
  dailyRoutine: z.enum(["sedenatry", "light", "moderate", "heavy", "very heavy"]),
  exerciseRoutine: z.array(z.object({
    exerciseType: z.enum(["cardio", "strength", "flexibility", "balance", "none"]),
    frequency: z.enum(["daily", "weekly", "monthly"])
  }))
})

const dietPreferences = z.object({
  preference: z.enum(["vegetarian", "non-vegetarian", "vegan", "pescatarian", "omnivore", "ketogenic", "paleo"]),
  allergies: z.array(z.string()),
  intolerances: z.array(z.string()),
  dislikedFood: z.array(z.string()).optional(),
  favouriteFood: z.array(z.string()).optional()
})

const healthGoals = z.object({
  weightGoal: z.enum(["gain", "loss", "maintain"]).optional(),
  specificNutritionGoal: z.string(),
  medicalConditions: z.array(z.string())
})

const eatingHabits = z.object({
  mealsPerDay: z.number(),
  mealComplexity: z.enum(["simple", "moderate", "complex"]),
  cookingTime: z.enum(["less than 30 minutes", "30-60 minutes", "more than 60 minutes"])
})

const constraints = z.object({
  financial: z.object({
    budget: z.number(),
    budgetType: z.enum(["daily", "weekly", "monthly"])
  }),
  geographical: z.object({
    location: z.string()
  })
})

export const userPreferencesValidatorObject = z.object({
  type: z.literal("userPreferences").optional(),
  basicInformation,
  lifeStyle,
  dietPreferences,
  healthGoals,
  eatingHabits,
  constraints
})

// TODO: Migrate away from Interfaces to Types slowly.
export interface IUserPreferences {
  user: Schema.Types.ObjectId;
  type: "userPreferences";
  basicInformation: IBasicInformation;
  lifeStyle: ILifeStyle;
  dietPreferences: IDietPreferences;
  healthGoals: IHealthGoals;
  eatingHabits: IEatingHabits;
  constraints: IConstraints;
}


export interface IHealthPlan {
  userId: {
    type: Schema.Types.ObjectId;
    ref: "Users";
    required: true;
  };
}


export interface IBasicInformation {
  age: number;
  weight: {
    value: number;
    unit: "Kilograms" | "Grams" | "Pounds";
  };
  height: {
    value: number;
    unit: "Centimeters";
  };
  gender: string;
}

export interface ILifeStyle {
  dailyRoutine: "sedenatry" | "light" | "moderate" | "heavy" | "very heavy";
  exerciseRoutine?: [
    {
      exerciseType: "cardio" | "strength" | "flexibility" | "balance" | "none";
      frequency: "daily" | "weekly" | "monthly";
    },
  ];
}

export interface IDietPreferences {
  preference:
  | "vegetarian"
  | "non-vegetarian"
  | "vegan"
  | "pescatarian"
  | "omnivore"
  | "ketogenic"
  | "paleo";
  allergies: string[];
  intolerances: string[];
  dislikedFood?: string[];
  favouriteFood?: string[];
}

export interface IHealthGoals {
  weightGoal?: "gain" | "loss" | "maintain";
  specificNutritionGoal: string;
  medicalConditions: string[];
}

export interface IEatingHabits {
  mealsPerDay: number;
  mealComplexity: "simple" | "moderate" | "complex";
  cookingTime:
  | "less than 30 minutes"
  | "30-60 minutes"
  | "more than 60 minutes";
}

export interface IConstraints {
  financial: {
    budget: number;
    budgetType: "daily" | "weekly" | "monthly";
  };
  geographical: {
    location: string;
  };
}


