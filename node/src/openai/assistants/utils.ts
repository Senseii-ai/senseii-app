// this will contain utility functions for the senseii application

import chalk from "chalk"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"
import { getCoreAssistantFunctionNames, getCoreAssistantTools } from "./core/assistant"
import { getOpenAIClient } from "../client"
import { IFunctionArguments } from "./functions"
import { ICreateNutritionPlanArguments } from "./nutrition/functions"

// parameter parser.
// TODO: locally store the functions supported by each assistant.
// TODO: implement Function argument interface and type for each assistant.
// TODO: implement the parsing function of each assistant tool
const client = getOpenAIClient() 

// TODO: Eventually make this more generic so it can parse functions of any assistant type.
export const parseFunctionArguments = async(tool: RequiredActionFunctionToolCall): Promise<IFunctionArguments>=>{
    const supportedTools = await getCoreAssistantFunctionNames(client)
    const toolName = tool.function.name
    try {
        if (!supportedTools.includes(toolName)){
            throw new Error("Function not supported by the core assistant")
        }
     switch(toolName){
        // parese the arguments for the getNutritionPlan function
        case "getNutritionPlan":
            console.log(chalk.green("parsing arguments for getNutritionPlan function"))
            const parsedData  = JSON.parse(tool.function.arguments)
            const functionArguments : ICreateNutritionPlanArguments = {
                type: "createNutritionPlan",
                basicInformation: parsedData.basicInformation,
                lifeStyle: parsedData.lifeStyle,
                dietPreferences: parsedData.dietPreferences,
                healthGoals: parsedData.healthGoals,
                eatingHabits: parsedData.eatingHabits,
                constraints: parsedData.constraints
            }
            return functionArguments
        default:
            throw new Error("Function not supported by the core assistant")
    }
    } catch (error) {
       console.error(chalk.red(error))
       throw error
    }
}