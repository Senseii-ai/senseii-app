import { createRun } from "@services/openai/assistants"
import { latestMessage, openAIUtils } from "@services/openai/utils";
import { getSummaryAssistantId } from "@services/openai/assistants/summary"
import { infoLogger } from "@utils/logger";
import { AzureOpenAI, OpenAIError } from "openai";
import { HTTP, Result } from "@senseii/types";

export const summaryAssistant = {
  summariseChat: (client: AzureOpenAI, threadId: string, wordLimit: number): Promise<Result<string>> => summariseChat(client, threadId, wordLimit)
}

export const summariseChat = async (client: AzureOpenAI, threadId: string, wordLimit: number): Promise<Result<string>> => {
  try {
    infoLogger({ message: "summarising chat", status: "INFO", layer: "SERVICE", name: "OAI:SUMMARISE CHAT" })
    const newMessage = openAIUtils.CreateMessage(`<WORD LIMIT>: ${wordLimit}`, "user")
    await openAIUtils.AddMessageToThread(client, threadId, newMessage)
    const response = await createRun(threadId, client, getSummaryAssistantId());
    if (!response) {
      infoLogger({ message: "error creating thread summarising run", status: "failed", layer: "SERVICE", name: "OAI:SUMMARIZE CHAT" })
      throw new OpenAIError("AI Provider error")
    }
    const summary = latestMessage(response[0]);
    if (!summary) {
      infoLogger({ message: "Error generating chat summary", status: "failed", layer: "SERVICE", name: "OAI:SUMMARIZE CHAT" })
      throw new OpenAIError("error generating summary")
    }
    const instructionMessage = latestMessage(response[1])
    // delete the summary message from thread
    await client.beta.threads.messages.del(threadId, summary?.messageId);
    await client.beta.threads.messages.del(threadId, instructionMessage?.messageId as string);
    return {
      success: true,
      data: summary.content
    }
  } catch (error) {
    if (error instanceof OpenAIError) {
      return {
        success: false,
        error: {
          code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
          message: error.message,
          timestamp: new Date().toISOString(),
          details: { stack: error.stack }
        }
      }
    }
    return {
      success: false,
      error: {
        code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
        message: "unknown error occured",
        timestamp: new Date().toISOString()
      }
    }
  }
};
