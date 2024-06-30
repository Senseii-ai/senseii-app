import { getOpenAIClient } from "../services/openai/openai.client";
import {
  getNewEmptyThread,
  retrieveMessages,
} from "../services/openai/assistants/threads";
import { IAuthRequest } from "../middlewares/auth";
import { Response } from "express";

const client = getOpenAIClient();

// createEmptyThread creates a new thread and returns the thread object.
export const createEmptyThread = async (req: IAuthRequest, res: Response) => {
  const response = await getNewEmptyThread(client);
  return res.status(200).json(response);
};

export const getThreadMessaegs = async (req: IAuthRequest, res: Response) => {
  const { threadId } = req.body;
  const messages = await retrieveMessages(threadId, client);
  return res.status(200).json(messages);
};
