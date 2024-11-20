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
  preferences: userPreferencesValidatorObject,
  nutritionPlan: nutritionPlanObject,
  workoutPlan: z.string(), // work in progress.
  startDate: z.date(),
  endDate: z.date().optional(),
  threads: threadsObject
})


export type IUserGoal = z.infer<typeof UserGoalDTO>
export type IThreads = z.infer<typeof threadsObject>
