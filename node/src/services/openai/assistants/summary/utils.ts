import { createRun } from "@services/openai/assistants"
import getOpenAIClient from "@services/openai/client";
import { latestMessage } from "@services/openai/utils";
import { getSummaryAssistantId } from "@services/openai/assistants/summary"
import { infoLogger } from "@utils/logger";

export const summariseChat = async (threadId: string) => {
  const client = getOpenAIClient();
  const response = await createRun(threadId, client, getSummaryAssistantId());
  if (!response) {
    infoLogger({ message: "Error creating thread summarising run", status: "failed" })
    return null;
  }
  const summary = latestMessage(response[0]);
  if (!summary) {
    throw new Error("Error summarising thread");
  }
  // delete the summary message from thread
  await client.beta.threads.messages.del(threadId, summary?.messageId);
  return summary.content;
};
