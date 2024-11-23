import { z } from "zod"
import { userPreferencesValidatorObject } from "./userPreferences";
import { nutritionPlanObject } from "../interfaces";

const threadsObject = z.object({
  coreThreadId: z.string(),
  nutritionThreadId: z.string(),
  workoutThreadId: z.string(),
})

export const UserGoalDTO = z.object({
  user: z.string().optional(),
  goalName: z.string(),
  description: z.string(),
  preferences: userPreferencesValidatorObject.optional(),
  nutritionPlan: nutritionPlanObject.optional(),
  workoutPlan: z.string().optional(), // work in progress.
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  threads: threadsObject.optional()
})

export const InitialGoal = z.object({
  user: z.string().optional(),
  goalName: z.string(),
  description: z.string(),
  endDate: z.string().optional()
})

export type IInitialGoal = z.infer<typeof InitialGoal>

export type IUserGoal = z.infer<typeof UserGoalDTO>
export type IThreads = z.infer<typeof threadsObject>
