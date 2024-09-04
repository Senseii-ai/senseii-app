import { createRun } from "../run";
import { getSummaryAssistantId } from "./summary.assistant";
import { getOpenAIClient } from "../../openai.client";
import { latestMessage } from "../utils";

export const summariseChat = async (threadId: string) => {
  const client = getOpenAIClient();
  const response = await createRun(threadId, client, getSummaryAssistantId());
  if (!response) {
    console.error("Error creating thread summarising run");
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
