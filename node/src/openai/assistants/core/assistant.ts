import OpenAI from "openai";
import { CoreAssistantId } from "../constants";

export const getCoreAssistantId = () : string=>{
    const assistantId = CoreAssistantId
    if (typeof assistantId !== "string" || assistantId.length <= 0){
        throw new Error("Core Assistnat Id not set")
    }
    return assistantId
}

export const getCoreAssistant = async(client: OpenAI)=> {
    const assistantId = CoreAssistantId
    if (typeof assistantId !== "string" || assistantId.length <= 0){
        throw new Error("Core Assistnat Id not set")
    }
    const coreAssistant = await client.beta.assistants.retrieve(assistantId)
    return coreAssistant
}