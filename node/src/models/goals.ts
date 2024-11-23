import { Schema, model, Document, Types } from "mongoose"
import { IInitialGoal, IThreads, IUserGoal, UserGoalDTO } from "../types/user/goals";
import { UserPreferencesSchema } from "./userPreference";
import { NutritionPlanSchema } from "./nutritionPlan";
import { z } from "zod"
import { validateResponse } from "../services/openai/assistants/utils";
import { IBasicInformation, IConstraints, IDietPreferences, IEatingHabits, IHealthGoals, ILifeStyle } from "../types/user/userPreferences";
import { getUserId } from "../middlewares/auth";
import { infoLogger } from "../utils/logger/logger";
import { INutritionPlan } from "../types/interfaces";

interface IUserGoalDocument extends IUserGoal, Document { }

const ThreadsSchema = new Schema<IThreads>({
  coreThreadId: { type: String, required: true },
  nutritionThreadId: { type: String, required: true },
  workoutThreadId: { type: String, required: true }
})

// include the field for isActive.
const UserGoalSchema = new Schema<IUserGoalDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  goalName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  preferences: {
    type: UserPreferencesSchema,
  },
  nutritionPlan: {
    type: NutritionPlanSchema,
  },
  workoutPlan: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: Date,
  },
  threads: {
    type: ThreadsSchema,
  },
})

export const UserGoal = model<IUserGoalDocument>('UserGoal', UserGoalSchema)

// NOTE: mayne this can be improved in the future.
// updateBasicInformation updates the basic information field of a user document
export const saveUpdatedBasicInformaion = async (data: IBasicInformation) => {
  return await UserGoal.updateOne({ user: getUserId() }, { $set: { ["preferences.basicInformation"]: data } })
}

export const saveUpdatedDietPreferences = async (data: IDietPreferences) => {
  return await UserGoal.updateOne({ user: getUserId() }, { $set: { ["preferences.dietPreferences"]: data } })
}

export const saveUpdatedEatingHabits = async (data: IEatingHabits) => {
  return await UserGoal.updateOne({ user: getUserId() }, { $set: { ["preferences.eatingHabits"]: data } })
}

export const saveNutritionPlan = async (data: INutritionPlan) => {
  return await UserGoal.updateOne({ user: getUserId() }, { $set: { ["nutritionPlan"]: data } })
}

export const saveUpdatedUserConstraints = async (data: IConstraints) => {
  return await UserGoal.updateOne({ user: getUserId() }, { $set: { ["preferences.constraints"]: data } })
}

export const saveInitialGoal = async (data: IInitialGoal) => {
  const userGoalData: IUserGoal = {
    user: getUserId(),
    goalName: data.goalName,
    description: data.description,
    endDate: data.endDate
  }
  const newGoal = new UserGoal(userGoalData)
  return await newGoal.save()
}

export const saveUpdateUserHealthGoals = async (data: IHealthGoals) => {
  return await UserGoal.updateOne({ user: getUserId() }, { ["preferences.healthGoals"]: data })
}

export const saveUpdatedLifeStyle = async (data: ILifeStyle) => {
  return await UserGoal.updateOne({ user: getUserId() }, { ["preferences.lifeStyle"]: data })
}

// createUserGoal
export const saveUserGoal = async (args: string): Promise<IUserGoalDocument> => {
  try {
    // NOTE: currently gpt-4o doesn't support structured function calling, so this implementation 
    // is a workaround using gpt-4o-mini chat completions.
    infoLogger({ status: "alert", message: "calling create-goal function" })
    const validatedResponse = await validateResponse({ prompt: args, validatorSchema: UserGoalDTO, validatorSchemaName: "create-user-goal" })
    const userId = getUserId()
    const data: IUserGoal = {
      user: userId,
      preferences: validatedResponse.preferences,
      goalName: validatedResponse.goalName,
      description: validatedResponse.description,
      startDate: Date.now().toLocaleString()
    }
    // NOTE: maybe this is useless check
    const validatedData = UserGoalDTO.parse(data)
    infoLogger({ message: "user goal valid", status: "INFO" })
    const userGoal = new UserGoal(validatedData)
    return await userGoal.save()
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation Error, ${error.message}`)
    }
    throw error
  }
}
