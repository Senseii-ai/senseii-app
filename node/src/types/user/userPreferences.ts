import { z } from "zod"

export const basicInformation = z.object({
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

export const dietPreferences = z.object({
  preference: z.enum(["vegetarian", "non-vegetarian", "vegan", "pescatarian", "omnivore", "ketogenic", "paleo"]),
  allergies: z.array(z.string()),
  intolerances: z.array(z.string()),
  dislikedFood: z.array(z.string()).optional(),
  favouriteFood: z.array(z.string()).optional()
})

const healthGoals = z.object({
  weightGoal: z.enum(["gain", "loss", "maintain"]),
  specificNutritionGoal: z.string(),
  // TODO: medical conditions need better handling.
  medicalConditions: z.string()
})

export const eatingHabits = z.object({
  mealsPerDay: z.number(),
  mealComplexity: z.enum(["simple", "moderate", "complex"]),
  cookingTime: z.enum(["less than 30 minutes", "30-60 minutes", "more than 60 minutes"])
})

export const constraints = z.object({
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

export type IUserPreferences = z.infer<typeof userPreferencesValidatorObject>
export type IBasicInformation = z.infer<typeof basicInformation>
export type ILifeStyle = z.infer<typeof lifeStyle>
export type IDietPreferences = z.infer<typeof dietPreferences>
export type IHealthGoals = z.infer<typeof healthGoals>
export type IEatingHabits = z.infer<typeof eatingHabits>
export type IConstraints = z.infer<typeof constraints>
