import { IFunctionType } from "../functions";
import { saveInitialGoal, saveNutritionPlan, saveUpdatedUserConstraints, saveUpdatedDietPreferences, saveUpdatedBasicInformaion, saveUpdatedEatingHabits } from "../../../../models/goals";
import { InitialGoal } from "@senseii/types/user/goals"
import { validateResponse } from "@services/openai/utils";
import { basicInformation, constraints, dietPreferences, eatingHabits } from "../../../../types/user/userPreferences";
import { z } from "zod"
import { createNutritionPlan } from "../nutrition/nutrition.functions";

const createDietPlanFunc = async (args: string) => {
  const response = await createNutritionPlan(args)
  if (await saveNutritionPlan(response.nutritionPlan)) {
    return "User Diet Plan Created Successfully"
  }
  return "User Diet Plan Creation Failed"
}

// createInitialGoalFunction gets the string format funciton calling input
// validates them and saves them in the database.
const createInitialGoalFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchemaName: "create-initial-goal", validatorSchema: InitialGoal })
  if (await saveInitialGoal(validArgs)) {
    return "User Initial Goal Created Successfully"
  }
  return "User Initial Goal Creation Failed"
}

const updateUserBasicInfoFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchemaName: "update-basic-information", validatorSchema: basicInformation })
  if (await saveUpdatedBasicInformaion(validArgs)) {
    return "User Basic Information Updated Successfully"
  }
  return "User Basic Information Update Failed"
}

const updateEatingHabitsFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: eatingHabits, validatorSchemaName: "update-eating-habits" })
  if (await saveUpdatedEatingHabits(validArgs)) {
    return "User Eating Habits Updated Successfully"
  }
  return "User Eating Habits Update Failed"
}

const updateUserConstraints = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: constraints, validatorSchemaName: "update-user-constraints" })
  if (await saveUpdatedUserConstraints(validArgs)) {
    return "User Constraints Updated Successfully"
  }
  return "User Constraints Update Failed"
}

const updateDietPreferencesFunc = async (args: string) => {
  const validArgs = await getValidArguments({ data: args, validatorSchema: dietPreferences, validatorSchemaName: "update-diet-preferences" })
  if (await saveUpdatedDietPreferences(validArgs)) {
    return `User Diet Preferences Updated Successfully`
  }
  return "User Diet Preferences Update Failed"
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

export const getValidArguments = async<T extends z.ZodTypeAny>({ data, validatorSchema, validatorSchemaName }: { data: string, validatorSchema: T, validatorSchemaName: string }): Promise<z.infer<T>> => {
  const validate = validatorSchema.safeParse(data)
  if (!validate.success) {
    return await validateResponse({ prompt: data, validatorSchema: validatorSchema, validatorSchemaName: validatorSchemaName })
  }
  return validate.data
}
