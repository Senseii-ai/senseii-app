// list of all the supported functions in the application

import { createNutritionPlanFunction, } from "./nutrition/functions";

// each function will have these three properties
export interface IFunctionType {
  name : string
  function: Function
  funcitonDefinition: Function
  functionalityType: "Nutrition" | "Core" | "Fitness"
}


export const supportedFunctions: Record <string, IFunctionType> = {
  "createNutritionPlan": createNutritionPlanFunction
}

export const getSupportedFunctions = ()=>{
  return supportedFunctions
}



// TODO: implement this
// const fitnessAssistantFunctions = getFitnessAssistantFunctions()

// export type ISupportedFunctionKeys = NutritionFunctionKeys 

// export const isSupportedFunctionKey = (key: string): key is ISupportedFunctionKeys=>{
//     return key in 
// }

// const supportedFunctions : Record < ISupportedFunctionKeys, IFunctionType> = {
//     "createNutritionPlan": createNutritionPlanFunction
// }

// // returns a record of all the supported functions in the application.
// export const getSupportedFunctions = ()=> {
//     return supportedFunctions
// }


// export type IFunctionArguments = NutritionToolArguments | CoreToolArguments 