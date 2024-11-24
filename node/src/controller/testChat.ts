import { IAuthRequest } from "@middlewares/auth";
import { getCoreAssistantId } from "@services/openai/assistants/core";
import { continueThread } from "@services/openai";
// import { continueThread } from "@services/openai/assistants";
import getOpenAIClient from "@services/openai/client";
import { Response } from "express";
import { infoLogger } from "@utils/logger";

const client = getOpenAIClient();

export const chatCore = async (req: IAuthRequest, res: Response) => {
  try {
    const thread = "thread_EIQFLWEQLJvYLrmVriXgM1nz";
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
    infoLogger({ "status": "failed", message: error as string })
    throw error;
  }
};
