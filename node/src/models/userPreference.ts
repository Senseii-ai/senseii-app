import { Schema, model } from "mongoose";
import {
  IBasicInformation,
  ILifeStyle,
  IConstraints,
  IHealthGoals,
  IEatingHabits,
  IDietPreferences,
  IUserPreferences,
} from "@senseii/types";

interface IUserPreferencesDocument extends IUserPreferences, Document { }
interface IBasicInformationDocument extends IBasicInformation, Document { }
interface ILifeStyleDocument extends ILifeStyle, Document { }
interface IDietPreferencesDocument extends IDietPreferences, Document { }
interface IHealthGoalsDocument extends IHealthGoals, Document { }
interface IEatingHabitsDocument extends IEatingHabits, Document { }
interface IConstraintsDocument extends IConstraints, Document { }

export const IBasicInformationSchema: Schema<IBasicInformationDocument> = new Schema({
  age: Number,
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ["Kilograms", "Grams", "Pounds"],
    },
  },
  height: {
    value: Number,
    unit: {
      type: String,
      enum: ["Centimeters"],
    },
  },
  gender: String,

})

const ILifeStyleSchema: Schema<ILifeStyleDocument> = new Schema({
  dailyRoutine: {
    type: String,
    enum: ["sedenatry", "light", "moderate", "heavy", "very heavy"],
  },
  exerciseRoutine: [
    {
      exerciseType: {
        type: String,
        enum: ["cardio", "strength", "flexibility", "balance", "none"],
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
    },
  ],

})

const IDietPreferencesSchema: Schema<IDietPreferencesDocument> = new Schema({
  preference: {
    type: String,
    enum: [
      "vegetarian",
      "non-vegetarian",
      "vegan",
      "pescatarian",
      "omnivore",
      "ketogenic",
      "paleo",
    ],
  },
  allergies: [String],
  intolerances: [String],
  dislikedFood: [String],
  favouriteFood: [String],
})

const IHealthGoalsSchema: Schema<IHealthGoalsDocument> = new Schema({
  weightGoal: {
    type: String,
    enum: ["gain", "loss", "maintain"],
  },
  specificNutritionGoal: String,
  medicalConditions: String,
})

const IEatingHabitsSchema = new Schema<IEatingHabitsDocument>({
  mealsPerDay: Number,
  mealComplexity: {
    type: String,
    enum: ["simple", "moderate", "complex"]
  },
  cookingTime: {
    type: String,
    enum: ["less than 30 minutes", "30-60 minutes", "more than 60 minutes"],
  },

})

const IConstraintsSchema: Schema<IConstraintsDocument> = new Schema({
  financial: {
    budget: Number,
    budgetType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
  },
  geographical: {
    location: String,
  },
})

export const UserPreferencesSchema: Schema<IUserPreferencesDocument> = new Schema({
  basicInformation: { type: IBasicInformationSchema, requried: true },
  lifeStyle: { type: ILifeStyleSchema, requried: true },
  dietPreferences: { type: IDietPreferencesSchema, requried: true },
  healthGoals: { type: IHealthGoalsSchema, requried: true },
  eatingHabits: { type: IEatingHabitsSchema, requried: true },
  constraints: { type: IConstraintsSchema, requried: true }
})

export const UserPreferencesModel = model<IUserPreferencesDocument>(
  "UserPreferences",
  UserPreferencesSchema
)
