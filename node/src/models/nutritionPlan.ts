import { Schema, model, Document } from "mongoose";
import {
  INutritionPlan,
  IDailyNutritionPlan,
  IItems,
  IMacroNutrients,
  IMicroNutrients,
  IMeals,
} from "@senseii/types";

interface IItemsDocument extends IItems, Document { }
interface IMacroNutrientsDocument extends IMacroNutrients, Document { }
interface IMicroNutrientsDocument extends IMicroNutrients, Document { }
interface IMealsDocument extends IMeals, Document { }
interface IDailyNutritionPlanDocument extends IDailyNutritionPlan, Document { }
interface INutritionPlanDocument extends INutritionPlan, Document { }

const ItemsSchema: Schema<IItemsDocument> = new Schema({
  item: { type: String, required: true },
  proportion: { type: Number, required: true },
  unit: { type: String, enum: ["grams", "kilograms", "count"], required: true },
});

const MacroNutrientsSchema: Schema<IMacroNutrientsDocument> = new Schema({
  protein: { type: Number, required: true },
  dietryFat: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  water: { type: Number, required: true },
});

const MicroNutrientsSchema: Schema<IMicroNutrientsDocument> = new Schema({
  // TODO: Define these more properly
  vitamins: { type: Number, required: true },
  dietryMinerals: { type: Number, required: true },
});

const MealsSchema: Schema<IMealsDocument> = new Schema({
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

const DailyNutritionPlanSchema: Schema<IDailyNutritionPlanDocument> =
  new Schema({
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
  });

export const NutritionPlanSchema: Schema<INutritionPlanDocument> = new Schema({
  plan: { type: [DailyNutritionPlanSchema], required: true },
});

const NutritionPlanModel = model<INutritionPlan>(
  "NutritionPlan",
  NutritionPlanSchema,
);

export default NutritionPlanModel;
