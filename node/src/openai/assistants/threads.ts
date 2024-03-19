import { ThreadCreateParams} from "openai/resources/beta/threads/threads";
import OpenAI from "openai";
import { MessageCreateParams} from "openai/resources/beta/threads/messages/messages";
import { createRun } from "./run";

export const continueThread = async(threadId: string, client: OpenAI, message: MessageCreateParams, assistantId: string)=>{
    const newMessage = client.beta.threads.messages.create(threadId, message)
    const response = await createRun(threadId, assistantId, client)
    return response
}
export const getNewThreadWithMessages= async(messages: ThreadCreateParams.Message[], client: OpenAI)=>{
    const thread = await client.beta.threads.create({
        messages: messages
    })
    return thread
}

export const getNewEmptyThread = async(messages: ThreadCreateParams.Message[], client: OpenAI) => {
    const thread = await client.beta.threads.create()
    return thread
}

export const getThreadById = async(threadId: string, client: OpenAI)=>{
    const thread = await client.beta.threads.retrieve(threadId)
    return thread
}