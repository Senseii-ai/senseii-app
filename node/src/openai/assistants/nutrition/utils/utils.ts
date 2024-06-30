import Joi, { string } from "joi";
import { IBloodGlucoseRecord } from "../../../../types/vitals";
import { IUserPreferences } from "../../../../types/user/userPreferences";
import chalk from "chalk";

export const Hello = (word: string): string => {
  return `Hello ${word}`
}

// Maybe these validations will be seperated at some later point
// const userPreferenceRecordSchema: Joi.ObjectSchema<IUserPreferences> = Joi.object({
//   type: Joi.string().valid('userPreferences'),
//   basicInformation: Joi.object(
//     {
//       age: Joi.number().required(),
//       weight: Joi.object({
//         value: Joi.number().required(),
//         unit: Joi.string().valid(["Kilograms", "Pounds", "Grams"]).required(),
//       }),
//       height: Joi.object({
//         value: Joi.number().required(),
//         unit: Joi.string().valid("Centimeters").required(),
//       }),
//       gender: Joi.string().required()
//     }
//   ).required(),
//   lifeStyle: Joi.object({
//     dailyRoutine: Joi.string().valid(["sedenatry", "light", "moderate", "heavy", "very heavy"]).required(),
//     exerciseRoutine: Joi.object({
//       exerciseType: Joi.string().valid(["cardio", "strength", "flexibility", "balance", "none"]).required(),
//       frtequency: Joi.string().valid(["daily", "weekly", "monthly"]).required(),
//     }).required(),
//   }).required(),
//   dietPreferences: Joi.object({
//     preference: Joi.string().valid(["vegetarian"
//       , "non-vegetarian"
//       , "vegan"
//       , "pescatarian"
//       , "omnivore"
//       , "ketogenic"
//       , "paleo"]).required(),
//     allergies: Joi.array().required(),
//     intolerances: Joi.array().required(),
//     dislikedFood: Joi.array(),
//     favouriteFood: Joi.array(),
//   }).required(),
//   healthGoals: Joi.object(
//     {
//       weightGoal: Joi.string().valid(["gain", "loss", "maintain"]),
//       specificNutritionGoal: Joi.string().required(),
//       medicalConditions: Joi.array(),
//     }
//   ).required(),
//   eatingHabits: Joi.object({
//     mealsPerDay: Joi.number().required(),
//     mealComplexity: Joi.string().valid(["simple", "moderate", "complex"]).required(),
//     cookingTime: Joi.string().valid(["less than 30 minutes", "30-60 minutes", "more than 60 minutes"]).required()
//   }).required(),
//   constraints: Joi.object(
//     {
//       financial: Joi.object({
//         budget: Joi.number().required(),
//         budgetType: Joi.string().valid(["daily", "weekly", "monthly"]).required(),
//       }),
//       geographical: Joi.object({
//         location: Joi.string().required(),
//       }).required()
//     }
//   ).required()
// })
//
// function validateUserPreference(jsonObject: any): Boolean {
//   try {
//     const error = userPreferenceRecordSchema.validate(jsonObject)
//     if (error) {
//       throw error
//     }
//     return true
//   }
//   catch (error) {
//     console.log(chalk.red("Error validating user preference Json object"))
//     throw error
//   }
// }
//
//
// export function StringToJson(assistantResponse: string): any {
//   try {
//     const jsonObject = JSON.parse(assistantResponse)
//     const isValid = validateUserPreference(jsonObject)
//     if (!isValid) {
//       console.error("User preferences fields missing")
//     }
//     return jsonObject
//   } catch (error) {
//     throw error
//   }
// }
