import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../openai/client";
import {
  continueThread,
  getNewThreadWithMessages,
} from "../openai/assistants/threads";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { createRun } from "../openai/assistants/run";
import { getCoreAssistantId } from "../openai/assistants/core/assistant";
import chalk from "chalk";
import { MessageCreateParams } from "openai/resources/beta/threads/messages/messages";

const OpenAIClient = getOpenAIClient();

export interface IMessage {
  role: "user"
  content: string
}

// the user initiates a new chat
export const startChat = async (req: IAuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const inputMessage: MessageCreateParams = {
      role: message.role,
      content: message.content
    }
    const coreAssistantId = getCoreAssistantId()
    // since thread does not exist, ceate a new one
    const thread = await getNewThreadWithMessages(inputMessage, OpenAIClient);
    console.log(chalk.green(thread.id))
    // create a run with the messages
    const response = await createRun(thread.id, OpenAIClient, coreAssistantId)
    // return the response
    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    throw error
  }
};

// the user consinues an old chat
export const continueChat = async (req: IAuthRequest, res: Response) => {
  try {
    const { threadId, message } = req.body;
    if (typeof threadId !== "string") {
      throw new Error("threadId or message not provided")
    }

    const inputMessage: MessageCreateParams = {
      role: "user",
      content: message?.content
    }
    const coreAssistantId: string = getCoreAssistantId()
    const response = await continueThread(threadId, OpenAIClient, inputMessage, coreAssistantId)
    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    throw error
  }
}
