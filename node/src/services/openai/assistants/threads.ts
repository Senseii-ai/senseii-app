import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { AzureOpenAI } from "openai";
import { createRun } from "./run";
import {
  Message,
  MessageCreateParams,
} from "openai/resources/beta/threads/messages";
import { infoLogger } from "../../../utils/logger/logger";
import { chat } from "../../../controller/chat";
import { supportedFunctions } from "./functions";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { Stream } from "openai/streaming";
import { RequiredActionFunctionToolCall, RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs";

export interface StreamCallbacks {
  onMessage?: (message: string) => Promise<void> | void;
  onError?: (error: any) => Promise<void> | void;
  onComplete?: () => Promise<void> | void;
}

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export const getChatsFromThreadIds = async (threadIds: chat[]) => {
  infoLogger({ message: "getting all chats from threads" });
  try {
    let finalResponse: Chat[] = [];
    for (const thread of threadIds) {
      finalResponse.push({
        id: thread.id,
        title: thread.title,
        createdAt: new Date(),
        userId: thread.userId,
        path: `/chat/${thread.id}`,
        messages: [],
        sharePath: "sharing not supported",
      });
    }

    return finalResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function createStreamableRun(
  client: AzureOpenAI,
  threadId: string,
  assistantId: string,
  callbacks: StreamCallbacks,
) {
  infoLogger({ message: "creating a streamable run" });

  try {
    let stream = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    // Process stream events until completion
    await processStream(stream, client, threadId, callbacks);

    infoLogger({ message: "RUN SUCCESSFUL" });
    callbacks.onComplete?.();
  } catch (error) {
    callbacks.onError?.(error);
    throw error;
  }
}

// recursively processing stream
async function processStream(
  stream: Stream<AssistantStreamEvent>,
  client: AzureOpenAI,
  threadId: string,
  callbacks: StreamCallbacks,
) {
  for await (const event of stream) {
    if (event.event === "thread.run.completed") {
      break;
    }

    if (event.event === "thread.run.requires_action") {
      stream = await handleToolAction(event, client, threadId, callbacks);
      // Process the new stream after tool submission
      await processStream(stream, client, threadId, callbacks);
      break; // Exit current stream processing as we're now handling the new stream
    }

    if (event.event === "thread.message.delta") {
      handleMessageDelta(event, callbacks);
    }
  }
}

const executeFunc = async (tool: RequiredActionFunctionToolCall) => {
  infoLogger({ status: "alert", message: `running tool ${tool.function.name}` })
  const toolToCall = supportedFunctions[tool.function.name];
  console.log("TOOL TO CALL", toolToCall.name)
  console.log("ARGUMENTS", tool.function.arguments)
  const response = await toolToCall.function(tool.function.arguments);
  infoLogger({
    message: `Tool Call:${toolToCall.functionalityType}`, status: "alert",
  });
  const toolOutput: RunSubmitToolOutputsParams.ToolOutput = {
    tool_call_id: tool.id,
    output: response
  }
  return toolOutput
}

async function handleToolAction(
  event: AssistantStreamEvent.ThreadRunRequiresAction,
  client: AzureOpenAI,
  threadId: string,
  callbacks: StreamCallbacks,
): Promise<Stream<AssistantStreamEvent>> {
  const toolCalls = event.data.required_action?.submit_tool_outputs.tool_calls;
  console.log("FOLLOWING TOOL CALL WAS MADE", toolCalls)

  if (!toolCalls?.length) {
    infoLogger({
      message: "function call requested but tool not specified",
      status: "failed",
    });
    callbacks.onError?.("internal server error");
    throw new Error("No tool calls specified");
  }

  const resolvedResponses: RunSubmitToolOutputsParams.ToolOutput[] = []
  for (const tool of toolCalls) {
    const response = await executeFunc(tool)
    resolvedResponses.push(response)
  }

  // TODO: Implement logic to parse JSON to create Modal for getting user's final Approval.
  // const markdown = ParseJSONToMarkdown(response);

  let newStream
  if (resolvedResponses.length > 0) {
    newStream = await client.beta.threads.runs.submitToolOutputs(
      threadId,
      event.data.id,
      {
        stream: true,
        tool_outputs: resolvedResponses
      },
    );
  }
  if (!newStream) {
    callbacks.onError?.("internal server error");
    throw new Error("Tool Call Failed");
  }
  infoLogger({ message: "Response submitted" });
  return newStream;
}

function handleMessageDelta(event: any, callbacks: StreamCallbacks) {
  if (event.data.delta.content?.[0]?.type === "text") {
    callbacks.onMessage?.(event.data.delta.content[0].text?.value as string);
  }
}

// addMessageToThread adds a message to a thread, when a threadId is provided.
export const addMessageToThread = async (
  client: AzureOpenAI,
  threadId: string,
  inputMessage: MessageCreateParams,
) => {
  try {
    const addedMessage = await client.beta.threads.messages.create(
      threadId,
      inputMessage,
    );
    return addedMessage;
  } catch (error) {
    console.error("Error adding message to thread");
    throw error;
  }
};

// createMessage creates a message in a thread, when a message and threadId are provided.
export const createMessage = async (
  message: string,
  client: AzureOpenAI,
  threadId: string,
) => {
  try {
    // create the message
    const inputMessage: MessageCreateParams = {
      role: "user",
      content: message,
    };

    // add message to the thread
    const addedMessage = await addMessageToThread(
      client,
      threadId,
      inputMessage,
    );
    return addedMessage;
  } catch (error) {
    console.error("Error creating message and adding to the thread");
    throw error;
  }
};

export const continueThread = async (
  threadId: string,
  client: AzureOpenAI,
  message: MessageCreateParams,
  assistantId: string,
) => {
  try {
    client.beta.threads.messages.create(threadId, message);
    const response = await createRun(threadId, client, assistantId);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNewThreadWithMessages = async (
  message: ThreadCreateParams.Message,
  client: AzureOpenAI,
): Promise<string> => {
  const messages = [message];
  const thread = await client.beta.threads.create({
    messages: messages,
  });
  return thread.id;
};

export const getNewEmptyThread = async (client: AzureOpenAI) => {
  const thread = await client.beta.threads.create();
  return thread;
};

export const getThreadById = async (threadId: string, client: AzureOpenAI) => {
  const thread = await client.beta.threads.retrieve(threadId);
  return thread;
};

export const retrieveMessages = async (
  threadId: string,
  client: AzureOpenAI,
) => {
  const messages = await client.beta.threads.messages.list(threadId);
  return messages;
};
