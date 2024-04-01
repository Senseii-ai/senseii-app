// this will contain utility functions for the senseii application

import chalk from "chalk"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"
import { getCoreAssistantFunctionNames, getCoreAssistantTools } from "./core/assistant"
import { getOpenAIClient } from "../client"

// parameter parser.
// TODO: locally store the functions supported by each assistant.
// TODO: implement Function argument interface and type for each assistant.
const client = getOpenAIClient() 

export const parseFunctionArguments = async(tool: RequiredActionFunctionToolCall)=>{
    const supportedTools = await getCoreAssistantFunctionNames(client)
    const toolName = tool.function.name
    try {
        if (!supportedTools.includes(toolName)){
            throw new Error("Function not supported by the core assistant")
        }
     switch(toolName){
        case "getNutritionPlan":
            console.log(chalk.green("parsing arguments for getNutritionPlan function"))
    }   
    } catch (error) {
       console.error(chalk.red(error))
       throw error
    }
}