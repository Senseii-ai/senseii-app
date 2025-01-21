import { StreamHandler } from "@utils/http";
import getOpenAIClient from "./client";
import { CoreAssistantId } from "./assistants";
import { userProfileStore } from "@models/userProfile";
import { infoLogger } from "@utils/logger";
import { AppError, HTTP, IChat, Result, RunRequestDTO } from "@senseii/types";
import { openAIUtils } from "./utils";
import { summaryAssistant } from "./assistants/summary";

const client = getOpenAIClient();

const layer = "SERVICE";
const name = "OPENAI";

export const openAIService = {
  StreamComplete: (data: RunRequestDTO, handler: StreamHandler) =>
    streamComplete(data, handler),
  SummariseThread: (
    threadId: string,
    wordLimit: number
  ): Promise<Result<string>> =>
    summaryAssistant.summariseChat(client, threadId, wordLimit),
  GetChatMessages: (chatId: string, userId: string): Promise<Result<IChat>> =>
    getChatMessages(chatId, userId),
};

/**
 * getChatMessages returns all the messages in the thread
 */
const getChatMessages = async (
  chatId: string,
  userId: string
): Promise<Result<IChat>> => {
  infoLogger({
    message: `get message for chat: ${chatId}: user: ${userId}`,
    layer,
    name,
  });
  const response = await userProfileStore.GetChat(userId, chatId);
  if (!response.success) {
    return response;
  }
  // const { threadId } = response.data
  // const chats = await client.beta.threads.messages.list(threadId)
  infoLogger({
    message: "chats found successfully",
    status: "success",
    layer,
    name,
  });
  return {
    success: true,
    data: response.data,
  };
};

/**
 * streamComplete creates a streamable run on the backend.
 */
const streamComplete = async (
  data: RunRequestDTO,
  handler: StreamHandler,
  assistantId?: string
) => {
  try {
    infoLogger({
      message: "creating a streamable run",
      status: "INFO",
      layer: "SERVICE",
      name: "OPENAI",
    });
    // start stream processing
    // handler.onMessage(createStreamStart())

    // gettingthe assistant id
    let assistant_id = assistantId ? assistantId : (CoreAssistantId as string);

    // check if chat exists.
    const response = await userProfileStore.GetChat(data.userId, data.chatId);
    if (!response.success) {
      infoLogger({
        message: "chat does not exist",
        status: "failed",
        layer,
        name,
      });
      handler.onComplete();
      return;
    }

    infoLogger({ message: `getting threads for ${response.data.threadId}` })
    const threadMessages = await client.beta.threads.messages.list(response.data.threadId)

    // add the user message to the thread.
    await openAIUtils.AddMessageToThread(client, response.data.threadId, openAIUtils.CreateMessage(data.content, "user"))

    // create a stream and process it.
    let stream = client.beta.threads.runs.stream(response.data.threadId, {
      assistant_id: assistant_id,
    });
    await openAIUtils.ProcessStream(
      stream,
      client,
      response.data.threadId,
      handler
    );
    infoLogger({
      message: "creating a streamable run -> success",
      status: "success",
      layer: "SERVICE",
      name: "OPENAI",
    });
  } catch (error) {
    infoLogger({
      message: `error processing stream ${error}`,
      status: "failed",
      layer: "SERVICE",
      name: "OPENAI",
    });
    const err: AppError = {
      code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
      message: "internal server error",
      timestamp: new Date().toISOString(),
    };
    return handler.onError(err);
  }
};
