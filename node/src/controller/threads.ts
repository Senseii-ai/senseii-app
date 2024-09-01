import { getOpenAIClient } from "../services/openai/openai.client";
import {
  getNewEmptyThread,
  retrieveMessages,
} from "../services/openai/assistants/threads";
import { IAuthRequest } from "../middlewares/auth";
import { Response } from "express";

const client = getOpenAIClient();

const sampleThreadMessages = [
  {
    role: "user",
    message: "Hello I need help",
  },
  {
    role: "assistant",
    message: "What can I help you with",
  },
  {
    role: "user",
    message: "I want to loose weight",
  },
  {
    role: "assistant",
    message: "Please share more informatino about yourself",
  },

  {
    role: "user",
    message: "Hello I need help",
  },
  {
    role: "assistant",
    message: "What can I help you with",
  },
  {
    role: "user",
    message: "I want to loose weight",
  },
  {
    role: "assistant",
    message: "Please share more informatino about yourself",
  },
  {
    role: "user",
    message: "Hello I need help",
  },
  {
    role: "assistant",
    message: "What can I help you with",
  },
  {
    role: "user",
    message: "I want to loose weight",
  },
  {
    role: "assistant",
    message: "Please share more informatino about yourself",
  },
  {
    role: "user",
    message: "Hello I need help",
  },
  {
    role: "assistant",
    message: "What can I help you with",
  },
  {
    role: "user",
    message: "I want to loose weight",
  },
  {
    role: "assistant",
    message: "Please share more informatino about yourself",
  },
];

// createEmptyThread creates a new thread and returns the thread object.
export const createEmptyThread = async (req: IAuthRequest, res: Response) => {
  const response = await getNewEmptyThread(client);
  return res.status(200).json(response);
};

// FIX: Fix this
export const getThreadMessaegs = async (req: IAuthRequest, res: Response) => {
  // const { threadId } = req.body;
  // const messages = await retrieveMessages(threadId, client);
  return res.status(200).json(sampleThreadMessages);
};
