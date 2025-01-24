import chalk from "chalk";
import getOpenAIClient from "@services/openai/client";
import { IFunctionType, supportedFunctions } from "@services/openai/assistants";
import {
  HTTP,
  ICreateNutritionPlanArguments,
  createError,
} from "@senseii/types";
import {
  Message,
  MessageCreateParams,
} from "openai/resources/beta/threads/messages";
import { Assistants } from "@services/openai/assistants";
import {
  Assistant,
  AssistantCreateParams,
  AssistantStreamEvent,
} from "openai/resources/beta/assistants";
import { infoLogger } from "@utils/logger";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { AzureOpenAI } from "openai";
import {
  StreamHandler,
  createEventMessage,
  createStreamContent,
} from "@utils/http";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { AssistantStream } from "openai/lib/AssistantStream";
import {
  RequiredActionFunctionToolCall,
  RunSubmitToolOutputsParams,
} from "openai/resources/beta/threads/runs/runs";

const client = getOpenAIClient();
const layer = "SERVICE";
const name = "OAI URILS";

export const openAIUtils = {
  GetStateChangeMessage: (state: AssistantStreamEvent) => getStateChangeMessage(state),
  CreateEmptyThread: () => createEmptyThread(),
  ProcessStream: (
    stream: AssistantStream,
    client: AzureOpenAI,
    threadId: string,
    handler: StreamHandler
  ) => processStream(stream, client, threadId, handler),
  CreateThreadWIthMessage: (
    client: AzureOpenAI,
    message: string,
    type: "user" | "assistant"
  ): Promise<string> => createThreadWithMessage(client, message, type),
  CreateMessage: (
    message: string,
    type: "user" | "assistant"
  ): ThreadCreateParams.Message => createMessage(message, type),
  BasicChatComplete: (
    client: AzureOpenAI,
    prompt: string,
    systemPrompt: string,
    model?: string
  ) => basicChatComplete(client, prompt, systemPrompt, model),
  AddMessageToThread: (
    client: AzureOpenAI,
    threadId: string,
    message: MessageCreateParams
  ) => addMessageToThread(client, threadId, message),
};

const getStateChangeMessage = (event: AssistantStreamEvent) => {
  if (event.event === "thread.run.in_progress") {
    return "generating ..."
  }
  if (event.event === "thread.run.created") {
    return "thinking ..."
  }
  if (event.event === "thread.run.requires_action") {
    return "running tools ..."
  }
  console.log("status", event.event)
  return "processing ..."
}

const createEmptyThread = async (): Promise<string> => {
  const thread = await client.beta.threads.create();
  return thread.id;
};

// recursively processing stream
async function processStream(
  stream: AssistantStream,
  client: AzureOpenAI,
  threadId: string,
  handler: StreamHandler,
  recursionDepth = 0
): Promise<void> {
  infoLogger({ message: "processing stream", status: "INFO", layer, name });
  const MAX_RECURSION_DEPTH = 10;

  // terminate processing if maximum recursion depth passes 10.
  if (recursionDepth > MAX_RECURSION_DEPTH) {
    infoLogger({
      message: "max recursion depth exceeded",
      status: "failed",
      layer,
      name,
    });
    throw createError(
      HTTP.STATUS.INTERNAL_SERVER_ERROR,
      "internal server error"
    );
  }

  // process stream per event.
  for await (const event of stream) {
    switch (event.event) {
      case "thread.run.completed":
        // run completed.
        infoLogger({
          message: "run completed successfully",
          status: "success",
          layer,
          name,
        });
        handler.onComplete()
        // save messages in the database, we can have a failover for syncinc thread messages with database.
        return;


      case "thread.run.requires_action":
        // handle tool call
        infoLogger({
          message: "processing tool action",
          status: "INFO",
          layer,
          name,
        });
        handler.onStateChange(createEventMessage(event))
        const newStream = await handleToolAction(
          event,
          client,
          threadId,
          handler
        );
        await processStream(
          newStream,
          client,
          threadId,
          handler,
          recursionDepth++
        );
        return;
      case "thread.message.delta":
        // handle message streaming delta.
        handler.onMessage(createStreamContent(event.data.delta));
        break
      default:
        console.log(event.event)
        handler.onStateChange(createEventMessage(event))
    }
  }
}

/**
 * handleToolAction executes the function and attaches the response in an Event stream
 * response.
 */
async function handleToolAction(
  event: AssistantStreamEvent.ThreadRunRequiresAction,
  client: AzureOpenAI,
  threadId: string,
  // FIX: This handler can be used to send events to Frontend, to render rich UI.
  handler: StreamHandler
): Promise<AssistantStream> {
  infoLogger({
    message: "below tool action triggered",
    status: "INFO",
    layer: "SERVICE",
    name: "OAI UTILS",
  });

  const toolCalls = event.data.required_action?.submit_tool_outputs.tool_calls;

  if (!toolCalls || toolCalls.length === 0) {
    infoLogger({
      message: "action required but tool not specified",
      status: "alert",
      layer: "SERVICE",
      name: "OAI UTILS",
    });
    throw createError(
      HTTP.STATUS.INTERNAL_SERVER_ERROR,
      "internal server error"
    );
  }

  toolCalls.map(item => console.log(item.function.name))

  try {
    // execute tools in parallel.
    const toolOutputs = await Promise.all(toolCalls.map(executeTool));

    // create new stream after submitting tool outputs.
    const newStream = client.beta.threads.runs.submitToolOutputsStream(
      threadId,
      event.data.id,
      {
        stream: true,
        tool_outputs: toolOutputs,
      }
    );

    if (!newStream) {
      throw new Error("unable to start a new run");
    }

    infoLogger({ message: "Tool Outputs submitted successfully" });
    return newStream;
  } catch (error) {
    infoLogger({
      message: "below error occured",
      layer,
      name,
      status: "failed",
    });
    console.error("Error handling tool action:", error);
    console.error("cancelling run")
    await client.beta.threads.runs.cancel(threadId, event.data.id)
    handler.onError?.(
      createError(HTTP.STATUS.INTERNAL_SERVER_ERROR, "internal server error")
    );
    throw error;
  }
}

/**
 * executeTool executes the requested function and returns an output that can be
 * directly submitted to an OpenAI stream.
 */
const executeTool = async (
  tool: RequiredActionFunctionToolCall
): Promise<RunSubmitToolOutputsParams.ToolOutput> => {
  infoLogger({
    message: `executing tool: ${tool.function.name}`,
    status: "INFO",
    layer: "SERVICE",
    name: "OAI UTILS",
  });

  console.log("tool arguments", tool.function.arguments)
  const toolFunction = supportedFunctions[tool.function.name];

  if (!toolFunction) {
    const errorMessage = `Unsupported Tool function: ${tool.function.name}`;
    infoLogger({ message: errorMessage, status: "failed", layer, name });
    throw createError(
      HTTP.STATUS.INTERNAL_SERVER_ERROR,
      "internal server error"
    );
  }

  const output = await toolFunction.function(tool.function.arguments);
  console.log(`output for ${tool.function.name}`, output)
  infoLogger({
    message: `tool executed successfully: ${tool.function.name}`,
    status: "success",
    layer,
    name,
  });
  return { tool_call_id: tool.id, output };
};

/**
 * basicChatComplete is an OpenAI utility for basic chat completion using gpt-4o-2.
 */
export const basicChatComplete = async (
  client: AzureOpenAI,
  prompt: string,
  systemPrompt: string,
  model = "gpt-4o-2"
) => {
  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return completion.choices[0].message.content || " ";
};

/**
 * chatComplete uses the OpenAI's chat completions API to return a response following a certain schema.
 */
export const chatComplete = async <T extends z.ZodTypeAny>({
  prompt,
  systemPrompt,
  validatorSchema,
  model = "gpt-4o-2",
  validatorSchemaName,
}: {
  prompt: string;
  systemPrompt: string;
  validatorSchema: T;
  model?: string;
  validatorSchemaName: string;
}): Promise<z.infer<T>> => {
  try {
    infoLogger({ message: "initiating chat completion" });
    const completion = await client.beta.chat.completions.parse({
      model: model,
      response_format: zodResponseFormat(validatorSchema, validatorSchemaName),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const output = completion.choices[0].message.parsed;
    if (!output) {
      infoLogger({
        message: "error complete chat",
        status: "failed",
        layer: "SERVICE",
        name: "OPENAI",
      });
      throw new Error("error completing chat");
    }
    infoLogger({
      message: "chat complete -> success",
      status: "success",
      layer: "SERVICE",
      name: "OPENAI",
    });
    return validatorSchema.parse(output);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error", error.errors);
      throw new Error("Failed to validate AI response");
    }
    // OpenAI error
    throw error;
  }
};

/**
 * createMessage creates an OpenAI message out of user message content.
 */
const createMessage = (
  content: string,
  type: "user" | "assistant"
): ThreadCreateParams.Message => {
  const message: ThreadCreateParams.Message = {
    content: content,
    role: type,
  };
  return message;
};

// addMessageToThread adds a message to a thread, when a threadId is provided.
export const addMessageToThread = async (
  client: AzureOpenAI,
  threadId: string,
  inputMessage: MessageCreateParams
) => {
  try {
    const addedMessage = await client.beta.threads.messages.create(
      threadId,
      inputMessage
    );
    return addedMessage;
  } catch (error) {
    console.error("Error adding message to thread");
    throw error;
  }
};

// parseFunctionArguments parses the function arguments based on the function definition.
export const parseFunctionArguments = async (
  functionArguments: string,
  functionDefinition: IFunctionType
) => {
  try {
    switch (functionDefinition.name) {
      case "createNutritionPlan":
        const parsedData = JSON.parse(functionArguments);
        const parsedFunctionArguments: ICreateNutritionPlanArguments = {
          type: "createNutritionPlan",
          basicInformation: parsedData.basicInformation,
          lifeStyle: parsedData.lifeStyle,
          dietPreferences: parsedData.dietPreferences,
          healthGoals: parsedData.healthGoals,
          eatingHabits: parsedData.eatingHabits,
          constraints: parsedData.constraints,
        };
        return parsedFunctionArguments;
    }
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

export const latestMessage = (message: Message) => {
  if (message.content[0].type === "text") {
    return {
      content: message.content[0].text.value,
      messageId: message.id,
    };
  }
};

interface IAssistant {
  id: string;
  name: string;
}

const createAssistant = async (
  client: AzureOpenAI,
  assistant: AssistantCreateParams,
  existingAssistants: IAssistant[]
) => {
  const alreadyExists = existingAssistants.filter(
    (item) => item.name === assistant.name
  );
  if (alreadyExists.length === 0) {
    const createdAssistant = await client.beta.assistants.create({
      name: assistant.name,
      instructions: assistant.instructions,
      model: assistant.model,
      tools: assistant.tools,
    });
    infoLogger({
      status: "success",
      message: `name: ${createdAssistant.name} Assistant ID: ${createdAssistant.id}`,
    });
  }
};

/**
 * write docs for this.
 */

export const validateResponse = async <T extends z.ZodTypeAny>({
  prompt,
  validatorSchema,
  validatorSchemaName,
}: {
  prompt: string;
  validatorSchema: T;
  validatorSchemaName: string;
}): Promise<z.infer<T>> => {
  const systemPrompt =
    "out of the user's input prompt, generate a structured output that follows the given schema in json properly";
  const validatedResponse = await chatComplete({
    prompt,
    validatorSchema,
    validatorSchemaName,
    systemPrompt,
  });
  infoLogger({
    status: "success",
    message: `valid data for ${validatorSchemaName} generated`,
  });
  return validatedResponse;
};

export const createAllAssistants = async (client: AzureOpenAI) => {
  const senseiiAssistants = Assistants;
  const assistantList = await client.beta.assistants.list();
  const existingAssistants = assistantList.data.reduce(
    (ids: IAssistant[], assistant: Assistant) => {
      ids.push({
        name: assistant.name as string,
        id: assistant.id,
      });
      return ids;
    },
    []
  );

  senseiiAssistants.map((item) => {
    createAssistant(client, item, existingAssistants);
  });
};

/**
 * getNewThreadWithMessages creates a new OpenAI thread using user messages.
 */
export const createThreadWithMessage = async (
  client: AzureOpenAI,
  message: string,
  type: "user" | "assistant"
): Promise<string> => {
  const createdMessage = openAIUtils.CreateMessage(message, type);
  const messages = [createdMessage];
  const thread = await client.beta.threads.create({
    messages: messages,
  });
  return thread.id;
};
