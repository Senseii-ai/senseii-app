import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../services/openai/openai.client";
import {
  continueThread,
  getNewThreadWithMessages,
} from "../services/openai/assistants/threads";
import { createRun } from "../services/openai/assistants/run";
import { getCoreAssistantId } from "../services/openai/assistants/core/core.assistant";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";
import { getNutritionAssistantId } from "../services/openai/assistants/nutrition/nutrition.assistant";
import { addChatToUser } from "../models/userInfo";
import { summariseChat } from "../services/openai/assistants/summary/utils";

const OpenAIClient = getOpenAIClient();

export interface IMessage {
  role: "user";
  content: string;
}

// the user initiates a new chat
export const startChat = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.userId as string;
    const message = req.body.message;
    const inputMessage: MessageCreateParams = {
      role: message.role,
      content: message.content,
    };
    const coreAssistantId = getCoreAssistantId();
    const threadId = await getNewThreadWithMessages(inputMessage, OpenAIClient);
    await createRun(threadId, OpenAIClient, coreAssistantId);
    const summary = await summariseChat(threadId);
    if (!summary) {
      return new Error("Error generating Summary");
    }
    const updatedProfile = addChatToUser(user, threadId, summary);
    if (!updatedProfile) {
      throw new Error("Error adding thread Id for user");
    }
    // return the response
    return res.status(200).json(threadId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// the user consinues an old chat
export const continueChat = async (req: IAuthRequest, res: Response) => {
  try {
    const { threadId, message } = req.body;
    if (typeof threadId !== "string") {
      throw new Error("threadId or message not provided");
    }

    const inputMessage: MessageCreateParams = {
      role: "user",
      content: message?.content,
    };
    const coreAssistantId: string = getCoreAssistantId();
    const response = await continueThread(
      threadId,
      OpenAIClient,
      inputMessage,
      coreAssistantId,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// chatting with the nutrition assistant
export const chatNutrition = async (req: IAuthRequest, res: Response) => {
  try {
    let { threadId, message } = req.body;
    const inputMessage: MessageCreateParams = {
      role: "user",
      content: message.content,
    };

    if (!threadId) {
      threadId = await getNewThreadWithMessages(inputMessage, OpenAIClient);
    }

    const nutritionAssistantId = getNutritionAssistantId();
    const response = await createRun(
      threadId,
      OpenAIClient,
      nutritionAssistantId,
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
