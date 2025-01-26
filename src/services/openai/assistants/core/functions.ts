import { IFunctionType } from "../functions";
import { saveInitialGoal, saveNutritionPlan, saveUpdatedUserConstraints, saveUpdatedDietPreferences, saveUpdatedBasicInformaion, saveUpdatedEatingHabits, saveUpdatedLifeStyle, saveUpdateUserHealthGoals, goalStore } from "../../../../models/goals";
import { chatComplete, validateResponse } from "@services/openai/utils";
import { NutritionPlan, basicInformation, constraints, dietPreferences, eatingHabits, lifeStyle, nutritionPlanObject, userPreferencesValidatorObject } from "@senseii/types";
import { z } from "zod"
import { getNutritionSystemPrompt } from "../nutrition";
import { getUserId } from "@middlewares/auth";
import HealthCalculator from "@services/scientific/metrics.calculator";

// FIX: remove this later.
export const healthGoals = z.object({
  weightGoal: z.enum(["gain", "loss", "maintain"]),
  specificNutritionGoal: z.string(),
  // TODO: medical conditions need better handling.
  medicalConditions: z.string()
})

const initialGoalDTO = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  endDate: z.number(),
  chatId: z.string(),
  healthGoal: healthGoals
})

// FIX: This needs to be moved in a separate place.
export type CreateInitialGoalDTO = z.infer<typeof initialGoalDTO>

// createInitialGoalFunction gets the string format funciton calling input
// validates them and saves them in the database.
const createInitialGoalFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchemaName: "create-initial-goal", validatorSchema: initialGoalDTO })
  if (await saveInitialGoal(validArgs)) {
    return "User Initial Goal Created Successfully"
  }
  return "User Initial Goal Creation Failed"
}

/**
 * @param args - The stringified JSON object holding function call arguments.
 * @returns The string response from LLM.
 */
const saveDietPlanFunc = async (args: string): Promise<string> => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: nutritionPlanObject, validatorSchemaName: "save-nutrition-plan" })
  const userId = getUserId()
  validArgs.userId = userId
  const response = await goalStore.SaveNutritionPlan(validArgs, userId)
  if (!response.success) {
    return "User Diet Plan saving Failed"
  }
  return "User Diet Plan Saved Successfully"
}

const createDietPlanFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: userPreferencesValidatorObject, validatorSchemaName: "create-nutrition-plan" })
  const nutritionPlan: NutritionPlan = await chatComplete({ prompt: JSON.stringify(validArgs), systemPrompt: getNutritionSystemPrompt("Monday"), validatorSchemaName: "create-nutrition-plan", validatorSchema: nutritionPlanObject })
  console.log(JSON.stringify(nutritionPlan))
  return JSON.stringify(nutritionPlan);
}

const updateLifeStyleFunc = async (args: string): Promise<string> => {
  console.log("before validating", args)
  const validArgs = await getValidArguments({ data: args, validatorSchemaName: "update_lifestyle", validatorSchema: lifeStyle })
  const userId = getUserId()
  console.log("valid args", validArgs, userId)
  if (await saveUpdatedLifeStyle(validArgs, userId)) {
    return "User LifeStyle Information updated Successfully"
  }
  return "User LifeStyle Information update Failed"
}

const updateHealthGoalFunc = async (args: string) => {
  console.log("before validating", args)
  const validArgs = await getValidArguments({ data: args, validatorSchema: healthGoals, validatorSchemaName: "update_health_goal" })
  const userId = getUserId()
  console.log("valid Args", validArgs, userId)
  if (await saveUpdateUserHealthGoals(validArgs, userId)) {
    return "User Health Goal Information updated Successfully"
  }
  return "User Health Goal Information update Failed"
}

const updateUserBasicInfoFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchemaName: "update-basic-information", validatorSchema: basicInformation })
  console.log("valid Args", validArgs)
  const userId = getUserId()
  console.log("userId", userId)
  if (await saveUpdatedBasicInformaion(validArgs, userId)) {
    return "User Basic Information Updated Successfully"
  }
  return "User Basic Information Update Failed"
}

const updateEatingHabitsFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: eatingHabits, validatorSchemaName: "update-eating-habits" })
  console.log("valid args", validArgs)
  if (await saveUpdatedEatingHabits(validArgs, getUserId())) {
    return "User Eating Habits Updated Successfully"
  }
  return "User Eating Habits Update Failed"
}

const updateUserConstraints = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: constraints, validatorSchemaName: "update-user-constraints" })
  console.log("valid args", validArgs)
  if (await saveUpdatedUserConstraints(validArgs, getUserId())) {
    return "User Constraints Updated Successfully"
  }
  return "User Constraints Update Failed"
}

const updateDietPreferencesFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: dietPreferences, validatorSchemaName: "update-diet-preferences" })
  console.log("valid args", validArgs)
  if (await saveUpdatedDietPreferences(validArgs, getUserId())) {
    return `User Diet Preferences Updated Successfully`
  }
  return "User Diet Preferences Update Failed"
}

const calculateMetrics = async () => {
  return await HealthCalculator.CalculateHealthMetrics(getUserId())
}

export const CalculateMetricsFunc: IFunctionType = {
  name: "calculateMetrics",
  function: calculateMetrics,
  functionalityType: "CORE"
}

export const UpdateUserConstraintsFunc: IFunctionType = {
  name: "updateUserConstraints",
  function: updateUserConstraints,
  functionalityType: "CORE"
}

export const CreateDietPlanFunc: IFunctionType = {
  name: "createDietPlan",
  function: createDietPlanFunc,
  functionalityType: "CORE"
}

export const UpdateDietPreferencesFunc: IFunctionType = {
  name: "updateDietPreferences",
  function: updateDietPreferencesFunc,
  functionalityType: "CORE"
}

export const UpdateEatingHabitsFunc: IFunctionType = {
  name: "updateEatingHabits",
  function: updateEatingHabitsFunc,
  functionalityType: "CORE"
}

export const CreateInitialGoalFunc: IFunctionType = {
  name: "createInitialGoalFunc",
  function: createInitialGoalFunc,
  functionalityType: "CORE"
}

export const UpdateUserBasicInfoFunc: IFunctionType = {
  name: "updateUserBasicInfoFunc",
  function: updateUserBasicInfoFunc,
  functionalityType: "CORE"
}

export const UpdateHealthGoalFunc: IFunctionType = {
  name: "updateHealthGoalFunc",
  function: updateHealthGoalFunc,
  functionalityType: "CORE"
}

export const UpdateLifeStyleFunc: IFunctionType = {
  name: "updateLifeStyleFunc",
  function: updateLifeStyleFunc,
  functionalityType: "CORE"
}

export const SaveDietPlanFunc: IFunctionType = {
  name: "saveDietPlanFunc",
  function: saveDietPlanFunc,
  functionalityType: "CORE"
}

export const getValidArguments = async<T extends z.ZodTypeAny>({ data, validatorSchema, validatorSchemaName }: { data: string, validatorSchema: T, validatorSchemaName: string }): Promise<z.infer<T>> => {
  const validate = validatorSchema.safeParse(data)
  if (!validate.success) {
    return await validateResponse({ prompt: data, validatorSchema: validatorSchema, validatorSchemaName: validatorSchemaName })
  }
  return validate.data
}
