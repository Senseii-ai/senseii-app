import { getOpenAIClient } from "../services/openai/openai.client";
import {
  getNewEmptyThread,
  retrieveMessages,
} from "../services/openai/assistants/threads";
import { IAuthRequest } from "../middlewares/auth";
import { Response } from "express";
import UserProfileModel, { getUserThreads } from "../models/userInfo";
import { MessagesPage } from "openai/resources/beta/threads/messages";

const client = getOpenAIClient();

// createEmptyThread creates a new thread and returns the thread object.
export const createEmptyThread = async (req: IAuthRequest, res: Response) => {
  const response = await getNewEmptyThread(client);
  return res.status(200).json(response.id);
};

// getThreadMessages retruns a list of all the messages
export const getThreadMessaegs = async (req: IAuthRequest, res: Response) => {
  try {
    const threadId = req.params.id;
    const response: MessagesPage = await retrieveMessages(threadId, client);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting thread messages", error);
    res.status(501).json({ message: "Internal server error" });
  }
};

export const getThreads = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params;
    const threads = await getUserThreads(userId.id);
    if (threads === undefined) {
      return res.status(200).json([]);
    }
    return res.status(200).json(threads);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error getting user threads" });
  }
};
