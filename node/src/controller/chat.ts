import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";
import { getOpenAIClient } from "../services/openai/openai.client";
import {
  StreamCallbacks,
  addMessageToThread,
  createStreamableRun,
  getChatsFromThreadIds,
  getNewThreadWithMessages,
} from "../services/openai/assistants/threads";
import { createRun } from "../services/openai/assistants/run";
import { getCoreAssistantId } from "../services/openai/assistants/core/core.assistant";
import {
  Message,
  MessageCreateParams,
} from "openai/resources/beta/threads/messages";
import { getNutritionAssistantId } from "../services/openai/assistants/nutrition/nutrition.assistant";
import {
  addChatToUser,
  getThreadAndUserByChatId,
  getThreadByChatId,
  getUserByUserId,
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

// TODO: Finish the below logic using same interfaces
export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export interface chat {
  id: string;
  title: string;
  threadId: string;
  createdAt?: Date;
  userId: string;
  path?: string;
  sharePath?: string;
}

export const getChats = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const userProfile = await getUserByUserId(userId);
    if (userProfile === null) {
      res.status(404).json({
        status: "failed",
        message: "User Does not Exist",
        data: [],
      });
      return;
    }

    const threadIds = userProfile.chats.reduce((threads: chat[], item) => {
      if (item.threadId) {
        threads.push({
          id: item.id,
          title: item.summary,
          threadId: item.threadId,
          userId: userId,
        });
      }
      return threads;
    }, []);

    const chats = await getChatsFromThreadIds(threadIds.slice(0, 10));
    infoLogger({ status: "success", message: "chats found successfully" });
    return res.status(200).json({
      status: "success",
      message: "all chats found successfully",
      data: chats,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "previous chats not found",
      data: [],
    });
  }
};

export const getChatMessages = async (req: IAuthRequest, res: Response) => {
  infoLogger({ message: "I WAS TRIGGERED", status: "success" });
  try {
    const { userId, chatId } = req.params;
    // NOTE: Maybe this implementation needs to be changed
    const chat = await getThreadByChatId(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    const response = await OpenAIClient.beta.threads.messages.list(
      chat?.threadId as string,
    );
    res.status(200).json({
      status: "success",
      message: "Chat found successfully",
      data: {
        title: chat.summary,
        messages: response.data,
        userId: userId,
        id: chat.id,
      },
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
