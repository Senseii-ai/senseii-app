import { Schema, model, Document } from "mongoose"
import { CreateUserGoalDTO, IBasicInformation, IConstraints, IDietPreferences, IEatingHabits, IHealthGoals, ILifeStyle, NutritionPlan, UserGoal } from "@senseii/types";
import { getUserId } from "@middlewares/auth";

interface UserGoalDocument extends UserGoal, Document { }

const UserGoalSchema: Schema<UserGoalDocument> = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "UserProfile"
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
    ref: "Chats"
  },
  workoutPlan: {
    type: String,
    // FIX: Connect when workout plans model is done.
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  nutritionPlan: {
    type: String,
    ref: "NutritionPlans"
  },
})

export const UserGoalModel = model<UserGoalDocument>('Goals', UserGoalSchema)

// NOTE: mayne this can be improved in the future.
// updateBasicInformation updates the basic information field of a user document
export const saveUpdatedBasicInformaion = async (data: IBasicInformation) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { $set: { ["preferences.basicInformation"]: data } })
}

export const saveUpdatedDietPreferences = async (data: IDietPreferences) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { $set: { ["preferences.dietPreferences"]: data } })
}

export const saveUpdatedEatingHabits = async (data: IEatingHabits) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { $set: { ["preferences.eatingHabits"]: data } })
}

export const saveNutritionPlan = async (data: NutritionPlan) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { $set: { ["nutritionPlan"]: data } })
}

export const saveUpdatedUserConstraints = async (data: IConstraints) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { $set: { ["preferences.constraints"]: data } })
}

export const saveInitialGoal = async (data: CreateUserGoalDTO) => {
  const userGoalData: CreateUserGoalDTO = {
    userId: getUserId(),
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    chatId: data.chatId
  }
  const newGoal = new UserGoalModel(userGoalData)
  return await newGoal.save()
}

export const saveUpdateUserHealthGoals = async (data: IHealthGoals) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { ["preferences.healthGoals"]: data })
}

export const saveUpdatedLifeStyle = async (data: ILifeStyle) => {
  return await UserGoalModel.updateOne({ user: getUserId() }, { ["preferences.lifeStyle"]: data })
}

// createUserGoal
// FIX: This needs to be fixed.
// export const saveUserGoal = async (args: string): Promise<UserGoalDocument> => {
//   try {
//     // NOTE: currently gpt-4o doesn't support structured function calling, so this implementation 
//     // is a workaround using gpt-4o-mini chat completions.
//     infoLogger({ status: "alert", message: "calling create-goal function" })
//     const validatedResponse = await validateResponse({ prompt: args, validatorSchema: UserGoalDTO, validatorSchemaName: "create-user-goal" })
//     const userId = getUserId()
//     const data: CreateUserGoalDTO= {
//       userId: userId,
//       preferences: validatedResponse.preferences,
//       title: validatedResponse.goalName,
//       description: validatedResponse.description,
//       startDate: Date.now().toLocaleString()
//     }
//     // NOTE: maybe this is useless check
//     const validatedData = UserGoalDTO.parse(data)
//     infoLogger({ message: "user goal valid", status: "INFO" })
//     const userGoal = new UserGoalModel(validatedData)
//     return await userGoal.save()
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       throw new Error(`Validation Error, ${error.message}`)
//     }
//     throw error
//   }
// }
