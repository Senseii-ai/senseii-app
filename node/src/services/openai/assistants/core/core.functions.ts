import { FunctionDefinition } from "openai/resources";
import { CREATE_GOAL_FUNC } from "./constants";
import { IFunctionType } from "../functions";

const getCreateGoalSchema = () => {
  const createGoalSchema: FunctionDefinition = CREATE_GOAL_FUNC.function
  return createGoalSchema
}
const createGoalFunction = async (args: any) => {
  console.log("Create Goal Implementation")
  return "create goal test function"
}

export const createGoal: IFunctionType = {
  name: "createGoal",
  function: createGoalFunction,
  funcitonDefinition: getCreateGoalSchema,
  functionalityType: "Core"
}

const coreAssistantFunctions = {
  createGoal,
}

export const getCoreAssistantFunctions = () => {
  return coreAssistantFunctions;
};


