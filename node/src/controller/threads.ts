import { getOpenAIClient } from "../openai/client"
import { getNewEmptyThread, retrieveMessages } from "../openai/assistants/threads"
import { IAuthRequest } from "../middlewares/auth"
import { Response } from "express"

const client = getOpenAIClient()

// createEmptyThread creates a new thread and returns the thread object.
export const createEmptyThread = async(req: IAuthRequest, res: Response)=>{
    const response = await getNewEmptyThread(client)
    return res.status(200).json(response)
}

export const getThreadMessaegs = async(req: IAuthRequest, res: Response)=> {
    const thread = "thread_L78Nc9I2bRWFFdDpbTmaUntn"
    const messages = await retrieveMessages(thread, client)
    return res.status(200).json(messages)
}