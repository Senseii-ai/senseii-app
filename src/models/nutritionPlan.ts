import { Schema, model, Document } from "mongoose";
import {
  NutritionPlan,
  DailyNutritionPlan,
  MealItems,
  MacroNutrients,
  MicroNutrients,
  Meals,
} from "@senseii/types";

interface ItemsDocument extends MealItems, Document { }
interface MacroNutrientsDocument extends MacroNutrients, Document { }
interface MicroNutrientsDocument extends MicroNutrients, Document { }
interface MealsDocument extends Meals, Document { }
interface DailyNutritionPlanDocument extends DailyNutritionPlan, Document { }
interface NutritionPlanDocument extends NutritionPlan, Document { }

const ItemsSchema: Schema<ItemsDocument> = new Schema({
  item: { type: String, required: true },
  proportion: { type: Number, required: true },
  unit: { type: String, enum: ["grams", "kilograms", "count"], required: true },
});

const MacroNutrientsSchema: Schema<MacroNutrientsDocument> = new Schema({
  protein: { type: Number, required: true },
  dietryFat: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  water: { type: Number, required: true },
});

const MicroNutrientsSchema: Schema<MicroNutrientsDocument> = new Schema({
  // TODO: Define these more properly
  vitamins: { type: Number, required: true },
  dietryMinerals: { type: Number, required: true },
});

const MealsSchema: Schema<MealsDocument> = new Schema({
  type: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true,
  },
  food: { type: String, required: true },
  macros: { type: MacroNutrientsSchema, required: true },
  micros: { type: MicroNutrientsSchema, required: true },
  calories: { type: Number },
  items: { type: [ItemsSchema], required: true },
});

const DailyNutritionPlanSchema: Schema<DailyNutritionPlanDocument> = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    meals: { type: [MealsSchema], required: true },
  }
);

const NutritionPlanSchema: Schema<NutritionPlanDocument> = new Schema({
  type: { type: String, default: "nutritionPlan" },
  userId: { type: String, required: true, unique: true, ref: "User" },
  dailyPlan: {
    plan: { type: [DailyNutritionPlanSchema], required: true },
  },
});

const NutritionPlanModel = model<NutritionPlanDocument>(
  "NutritionPlan",
  NutritionPlanSchema
);

export default NutritionPlanModel;
