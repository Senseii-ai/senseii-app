import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../openai/client";
import {
  continueThread,
  getNewThreadWithMessages,
} from "../openai/assistants/threads";
import { ThreadCreateParams} from "openai/resources/beta/threads/threads";
import { createRun } from "../openai/assistants/run";
import { getCoreAssistantId } from "../openai/assistants/assistant";
import { MessageCreateParams } from "openai/resources/beta/threads/messages/messages";

const OpenAIClient = getOpenAIClient();

export const chat = async (req: IAuthRequest, res: Response) => {
  try {
  } catch (error) {}
};

// the user initiates a new chat
export const startChat = async (req: IAuthRequest, res: Response) => {
  try {
    const { messages } : {messages: ThreadCreateParams.Message[]} = req.body;
    const coreAssistantId = await getCoreAssistantId()
    // since thread does not exist, create a new one
    const thread = await getNewThreadWithMessages(messages, OpenAIClient);
    // create a run with the messages
    const response = createRun(thread.id, coreAssistantId, OpenAIClient)
  } catch (error) {
    console.error(error)
    throw error
  }
};

// the user consinues an old chat
export const continueChat = async(req: IAuthRequest, res: Response)=> {
  try {
    const {threadId, message} : {threadId: string, message:MessageCreateParams }= req.body;
    const coreAssistantId : string = getCoreAssistantId()
    const response = continueThread(threadId, OpenAIClient, message, coreAssistantId)
    return response
  }catch(error){
    console.error(error)
    throw error
  }
}