import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../services/openai/openai.client";
import {
  continueThread,
  getNewThreadWithMessages,
} from "../services/openai/assistants/threads";
import { createRun } from "../services/openai/assistants/run";
import { getCoreAssistantId } from "../services/openai/assistants/core/core.assistant";
import {
  Message,
  MessageCreateParams,
} from "openai/resources/beta/threads/messages";
import { getNutritionAssistantId } from "../services/openai/assistants/nutrition/nutrition.assistant";
import UserProfileModel, {
  addChatToUser,
  getThreadAndUserByChatId,
  getThreadByChatId,
  getThreadById,
} from "../models/userInfo";
import { summariseChat } from "../services/openai/assistants/summary/utils";
import { infoLogger } from "../utils/logger/logger";
import { threadId } from "worker_threads";
import { ObjectId } from "mongoose";
import { InternalServerError } from "openai";

const OpenAIClient = getOpenAIClient();

export interface IChat {
  userId: string;
  threadId: string;
  messages: IMessage[];
}

export interface IMessage {
  role: "user";
  content: string;
}

export const getChats = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params;
  } catch (error) {}
};

export const getChatMessages = async (req: IAuthRequest, res: Response) => {
  infoLogger({ message: "GET CHAT", status: "success" });
  try {
    const { userId, chatId } = req.params;
    const threadId = await getThreadById(userId, chatId);
    const response = await OpenAIClient.beta.threads.messages.list(
      threadId?.id as string,
    );
    const chat = res.status(200).json({
      status: "success",
      message: "Chat found successfully",
      data: response.data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Chat not found successfully",
      data: error,
    });
  }
};

// chat API
export const chat = async (req: IAuthRequest, res: Response) => {
  try {
    const { userId, chatId, content } = req.body;
    if (typeof chatId !== "string") {
      throw new Error("threadId or message not provided");
    }

    // check if a chat with that thread Id already exists.
    const { user, existingThreadId } = await getThreadAndUserByChatId(chatId);

    const inputMessage: MessageCreateParams = {
      role: "user",
      content: content,
    };
    const coreAssistantId: string = getCoreAssistantId();

    if (existingThreadId) {
      // chat already exists, logic to continue chats.
      infoLogger({ message: "Chat already exists, continuing" });
      const response = await continueThread(
        existingThreadId.threadId,
        OpenAIClient,
        inputMessage,
        coreAssistantId,
      );

      if (!response) {
        return null;
      }

      // NOTE: Considering we are only dealing with text responses.
      let message = "";
      if (response[0].content[0].type === "text") {
        message = response[0].content[0].text.value;
      }

      return res.status(200).json({
        status: "success",
        message: "This will be the response",
        data: message,
      });
    } else {
      // Chat does not exists, logic to create a new chat
      infoLogger({ message: "Chat does not exists, creating new" });
      const threadId = await getNewThreadWithMessages(
        inputMessage,
        OpenAIClient,
      );
      const response = await createRun(threadId, OpenAIClient, coreAssistantId);
      if (!response) {
        throw new Error("Error creating run");
      }
      let message = "";
      if (response[0].content[0].type === "text") {
        message = response[0].content[0].text.value;
      }
      infoLogger({ message: "Response received" });
      const summary = await summariseChat(threadId);
      if (!summary) {
        return new Error("Error generating Summary");
      }
      const updatedProfile = addChatToUser(chatId, userId, threadId, summary);
      if (!updatedProfile) {
        throw new Error("Error adding thread Id for user");
      }

      infoLogger({
        message: "Successfull converation with Senseii",
        status: "success",
      });

      return res.status(200).json({
        status: "success",
        message: "This will be the response",
        data: message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: InternalServerError,
      message: "Error chatting with Senseii",
      data: "",
    });
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
