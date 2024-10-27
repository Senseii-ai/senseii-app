import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../services/openai/openai.client";
import {
  StreamCallbacks,
  addMessageToThread,
  createStreamableRun,
  getNewThreadWithMessages,
} from "../services/openai/assistants/threads";
import { createRun } from "../services/openai/assistants/run";
import { getCoreAssistantId } from "../services/openai/assistants/core/core.assistant";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";
import { getNutritionAssistantId } from "../services/openai/assistants/nutrition/nutrition.assistant";
import {
  addChatToUser,
  getThreadAndUserByChatId,
  getThreadById,
} from "../models/userInfo";
import { summariseChat } from "../services/openai/assistants/summary/utils";
import { infoLogger } from "../utils/logger/logger";

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
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
  try {
    const { userId, chatId, content } = req.body;
    if (typeof chatId !== "string") {
      throw new Error("threadId or message not provided");
    }

    // setup SSE
    res.writeHead(200, headers);

    // check if a chat with that thread Id already exists.
    const { existingThreadId } = await getThreadAndUserByChatId(chatId);

    const inputMessage: MessageCreateParams = {
      role: "user",
      content: content,
    };
    const coreAssistantId: string = getCoreAssistantId();

    // Define Streaming callbacks
    const callbacks: StreamCallbacks = {
      onMessage: async (message) => {
        const chunk = JSON.stringify({ content: message });
        res.write(`data: ${chunk}\n\n`);
      },
      onError: async (error) => {
        const errorChunk = JSON.stringify({ error: error.message });
        res.write(`data: ${errorChunk}\n\n`);
      },
      onComplete: async () => {
        res.write("data: DONE\n\n");
        res.end();
      },
    };

    if (existingThreadId) {
      // chat already exists, logic to continue chats.
      infoLogger({ message: "Thread already exists" });

      const updatedThread = await addMessageToThread(
        OpenAIClient,
        existingThreadId.threadId,
        inputMessage,
      );

      infoLogger({ message: "chat already exists, continuing" });
      await createStreamableRun(
        OpenAIClient,
        updatedThread.thread_id,
        coreAssistantId,
        callbacks,
      );
    } else {
      // Chat does not exists, logic to create a new chat
      infoLogger({ message: "Chat does not exists, creating new" });
      const threadId = await getNewThreadWithMessages(
        inputMessage,
        OpenAIClient,
      );
      await createStreamableRun(
        OpenAIClient,
        threadId,
        coreAssistantId,
        callbacks,
      );

      // post streaming tasks
      const summary = await summariseChat(threadId);
      if (!summary) {
        throw new Error("Error generating Summary");
      }

      const updatedProfile = await addChatToUser(
        chatId,
        userId,
        threadId,
        summary,
      );
      if (!updatedProfile) {
        throw new Error("Error adding thread Id for user");
      }
    }
  } catch (error) {
    console.error(error);
    const errorResponse = JSON.stringify({
      status: "error",
      message: "Error chatting with Senseii",
      error: error,
    });
    res.write(`data: ${errorResponse}\n\n`);
    res.end();
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
