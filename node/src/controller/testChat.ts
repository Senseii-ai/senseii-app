import { IAuthRequest } from "../middlewares/auth";
import { getCoreAssistantId } from "../services/openai/assistants/core/core.assistant";
import { continueThread } from "../services/openai/assistants/threads";
import { getOpenAIClient } from "../services/openai/openai.client";
import { Response } from "express";

const client = getOpenAIClient();

export const chatCore = async (req: IAuthRequest, res: Response) => {
  try {
    const thread = "thread_L78Nc9I2bRWFFdDpbTmaUntn";
    console.log(" I am here", thread);
    const assistant = getCoreAssistantId();
    const userMessage = req.body.message;
    const response = await continueThread(
      thread,
      client,
      userMessage,
      assistant,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
