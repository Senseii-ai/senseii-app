import { Schema, model, Document } from "mongoose"
import { IThreads, IUserGoal, UserGoalDTO } from "../types/user/goals";
import { UserPreferencesSchema } from "./userPreference";
import { NutritionPlanSchema } from "./nutritionPlan";
import { z } from "zod"

interface IUserGoalDocument extends IUserGoal, Document { }

const ThreadsSchema = new Schema<IThreads>({
  coreThreadId: { type: String, required: true },
  nutritionThreadId: { type: String, required: true },
  workoutThreadId: { type: String, required: true }
})

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
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  },
  threads: {
    type: ThreadsSchema,
  },
})

export const UserGoal = model<IUserGoalDocument>('UserGoal', UserGoalSchema)

// createUserGoal
export const createUserGoal = async (body: unknown): Promise<IUserGoalDocument> => {
  try {
    const validatedData = UserGoalDTO.parse(body)
    const userGoal = new UserGoal(validatedData)
    return await userGoal.save()
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation Error, ${error.message}`)
    }
    throw error
  }
}
