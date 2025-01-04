import { StreamHandler, createStreamStart } from "@utils/http"
import getOpenAIClient from "./client"
import { CoreAssistantId } from "./assistants"
import { userProfileStore } from "@models/userProfile"
import { infoLogger } from "@utils/logger"
import { AppError, HTTP, Result, RunRequestDTO } from "@senseii/types"
import { openAIUtils } from "./utils"
import { summaryAssistant } from "./assistants/summary"
import { userStore } from "@models/users"
import { Message } from "openai/resources/beta/threads/messages"
import { ChatWithMessages } from "@controller/chat"

const client = getOpenAIClient()

const layer = "SERVICE"
const name = "OPENAI"

export const openAIService = {
  StreamComplete: (data: RunRequestDTO, handler: StreamHandler) => streamComplete(data, handler),
  SummariseThread: (threadId: string, wordLimit: number): Promise<Result<string>> => summaryAssistant.summariseChat(client, threadId, wordLimit),
  GetChatMessages: (chatId: string, email: string): Promise<Result<ChatWithMessages>> => getChatMessages(chatId, email)
}

/**
 * getChatMessages returns all the messages in the thread
*/
const getChatMessages = async (chatId: string, email: string): Promise<Result<ChatWithMessages>> => {
  infoLogger({ message: `get message for chat: ${chatId}: user: ${email}`, layer, name })
  const response = await userProfileStore.GetThreadByChatId(chatId)
  if (!response.success) {
    return response
  }

  const { threadId } = response.data
  const chats = await client.beta.threads.messages.list(threadId)
  infoLogger({ message: "chats found successfully", status: "success", layer, name })
  return {
    success: true,
    data: {
      email: email,
      chatId: chatId,
      messages: chats.data
    }
  }
}

/**
 * streamComplete creates a streamable run on the backend.
*/
const streamComplete = async (data: RunRequestDTO, handler: StreamHandler, assistantId?: string) => {
  try {
    infoLogger({ message: "creating a streamable run", status: "INFO", layer: "SERVICE", name: "OPENAI" });
    // start stream processing
    handler.onMessage(createStreamStart())

    // gettingthe assistant id
    let assistant_id = assistantId ? assistantId : CoreAssistantId as string

    let threadId = ""
    const thread = await userProfileStore.GetThreadByChatId(data.chatId)
    if (thread.success) {

      // thread found in database.
      infoLogger({ message: `chat ${data.chatId} found` })
      threadId = thread.data.threadId
    } else {

      // error occured
      if (thread.error.code === HTTP.STATUS.NOT_FOUND) {

        // chat not found in database, create new.
        // FIX: Try to make this process parallel, currently it is blockgin the stream.
        infoLogger({ message: `chat ${data.chatId} does not exist, creating new` })
        threadId = await openAIUtils.CreateThreadWIthMessage(client, data.content, "user")

        // summarise the chat in <N> words.
        const summary = await openAIService.SummariseThread(threadId, 4)
        if (!summary.success) {
          return handler.onError(summary.error)
        }

        // Add the new chat to the user profile
        const response = await userProfileStore.AddChatToUser(data.chatId, data.userId, threadId, summary.data)
        if (!response.success) {
          return handler.onError(response.error)
        }
      } else {
        // internal server error
        return handler.onError(thread.error)
      }
    }

    let stream = client.beta.threads.runs.stream(threadId, {
      assistant_id: assistant_id
    })

    // create a stream and process it.
    await openAIUtils.ProcessStream(stream, client, threadId, handler)
    infoLogger({ message: "creating a streamable run -> success", status: "success", layer: "SERVICE", name: "OPENAI" });
  } catch (error) {
    infoLogger({ message: "error processing stream", status: "failed", layer: "SERVICE", name: "OPENAI" });
    const err: AppError = {
      code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
      message: 'internal server error',
      timestamp: new Date().toISOString()
    }
    return handler.onError(err)
  }
}
