import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import OpenAI from "openai";
import { createRun } from "./run";

export const continueThread = async (
  threadId: string,
  client: OpenAI,
  message: string,
  assistantId: string
) => {
  try {

    console.log("USER SENT THIS MESSAGE", message)
    console.log("THIS IS THE THREAD ID", threadId)
    const newMessage = client.beta.threads.messages.create(threadId, {role: "user", content: message});
    const thread = await getThreadById(threadId, client);
    console.log("This is thread",thread);
    const response = await createRun(threadId, assistantId, client);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNewThreadWithMessages = async (
  messages: ThreadCreateParams.Message[],
  client: OpenAI
) => {
  const thread = await client.beta.threads.create({
    messages: messages,
  });
  return thread;
};

export const getNewEmptyThread = async (client: OpenAI) => {
  const thread = await client.beta.threads.create();
  return thread;
};

export const getThreadById = async (threadId: string, client: OpenAI) => {
  const thread = await client.beta.threads.retrieve(threadId);
  return thread;
};

export const retrieveMessages = async (threadId: string, client :OpenAI)=>{
  const messages = await client.beta.threads.messages.list(threadId)
  return messages
}