import { Schema } from "mongoose";

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


