import chalk from "chalk";
import getOpenAIClient from "@services/openai/client"
import { IFunctionType, supportedFunctions } from "@services/openai/assistants";
import { HTTP, ICreateNutritionPlanArguments, createError } from "@senseii/types"
import { Message, MessageCreateParams, Text, TextDelta } from "openai/resources/beta/threads/messages";
import { Assistants } from "@services/openai/assistants";
import { Assistant, AssistantCreateParams } from "openai/resources/beta/assistants";
import { infoLogger } from "@utils/logger";
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod";
import { AzureOpenAI } from "openai";
import { StreamHandler, createStateUpdateMessage, createStreamContent, createStreamStart } from "@utils/http";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { AssistantStream } from "openai/lib/AssistantStream";
import { FunctionToolCall, ToolCall, ToolCallDelta } from "openai/resources/beta/threads/runs/steps";

let client = getOpenAIClient()

export const openAIUtils = {
  ProcessStream: (stream: AssistantStream,
    client: AzureOpenAI,
    threadId: string,
    callbacks: StreamHandler,
  ) => processStream(stream, client, threadId, callbacks),
  // HandleToolAction: (event: AssistantStreamEvent.ThreadRunRequiresAction,
  //   client: AzureOpenAI,
  //   threadId: string,
  //   handler: StreamHandler): Promise<Stream<AssistantStreamEvent>> => handleToolAction(event, client, threadId, handler),
  CreateThreadWIthMessage: (message: string, type: "user" | "assistant"
  ): Promise<string> => createThreadWithMessage(message, type),
  CreateMessage: (message: string, type: "user" | "assistant"): ThreadCreateParams.Message => createMessage(message, type)
}

/**
  * createMessage creates an OpenAI message out of user message content.
*/
const createMessage = (content: string, type: "user" | "assistant"): ThreadCreateParams.Message => {
  const message: ThreadCreateParams.Message = {
    content: content,
    role: type
  }
  return message
}

/**
 * getNewThreadWithMessages creates a new OpenAI thread using user messages.
*/
export const createThreadWithMessage = async (
  message: string,
  type: "user" | "assistant"
): Promise<string> => {
  const createdMessage = openAIUtils.CreateMessage(message, type)
  const messages = [createdMessage];
  const thread = await client.beta.threads.create({
    messages: messages,
  });
  return thread.id;
};

// recursively processing stream
async function processStream(
  run: AssistantStream,
  client: AzureOpenAI,
  threadId: string,
  handler: StreamHandler,
): Promise<void> {
  infoLogger({ message: "processing stream", status: "INFO", layer: "SERVICE", name: "OAI UTILS" })
  run
    .on("runStepCreated", () => handler.onMessage(createStreamStart()))
    // since we are only straming text, we are only looking at text delta.
    .on("textDelta", (text: TextDelta, snapshot: Text) => handleTextDelta(text, snapshot, handler))
    .on("toolCallDelta", (toolCallDelta: ToolCallDelta, toolCall: ToolCall) => handleToolAction(toolCall, handler))
    // .on("toolCallCreated", ()=> )
    .on("end", () => handler.onComplete())
}

async function handleToolAction(
  toolCall: ToolCall,
  handler: StreamHandler,
) {
  infoLogger({ message: "below tool action triggered", status: "INFO", layer: "SERVICE", name: "OAI UTILS" })
  // we only support function calling as of now.
  if (toolCall.type === "function") {
    handler.onMessage(createStateUpdateMessage("tool Call"))
    const response = await executeFunc(toolCall)
    // submit tool call response
    toolCall.function.output = response

  }
  infoLogger({ message: "below tool action successfull", status: "success", layer: "SERVICE", name: "OAI UTILS" })
}

/**
 * executeFunc executes one of the supported functions and returns the response in the 
 * Response object.
*/
const executeFunc = async (tool: FunctionToolCall): Promise<string> => {
  infoLogger({ status: "INFO", message: `running tool ${tool.function.name}` })

  const toolToCall = supportedFunctions[tool.function.name];
  if (!toolToCall) {
    infoLogger({ message: "tool not supported", status: "failed", name: "OAI UTILS", layer: "SERVICE" })
    const err = createError(HTTP.STATUS.INTERNAL_SERVER_ERROR, "internal server error")
    throw err
  }

  infoLogger({ status: "INFO", message: `calling tool ${toolToCall.name} with below arguments`, layer: "SERVICE", name: "OAI UTILS" })
  console.log(tool.function.arguments)

  const response = await toolToCall.function(tool.function.arguments);
  infoLogger({ status: "success", message: `tool ${toolToCall.name} successfully called`, layer: "SERVICE", name: "OAI UTILS" })
  return response
}


function handleTextDelta(message: TextDelta, snapshot: Text, handler: StreamHandler) {
  handler.onMessage(createStreamContent(message));
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



// parseFunctionArguments parses the function arguments based on the function definition.
export const parseFunctionArguments = async (
  functionArguments: string,
  functionDefinition: IFunctionType,
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
  id: string
  name: string
}

const createAssistant = async (assistant: AssistantCreateParams, existingAssistants: IAssistant[]) => {
  const alreadyExists = existingAssistants.filter(item => item.name === assistant.name)
  if (alreadyExists.length === 0) {
    const createdAssistant = await client.beta.assistants.create({
      name: assistant.name,
      instructions: assistant.instructions,
      model: assistant.model,
      tools: assistant.tools
    })
    infoLogger({ status: "success", message: `name: ${createdAssistant.name} Assistant ID: ${createdAssistant.id}` })
  }
}



export const validateResponse = async<T extends z.ZodTypeAny>({ prompt, validatorSchema, validatorSchemaName }: { prompt: string, validatorSchema: T, validatorSchemaName: string }): Promise<z.infer<T>> => {
  const systemPrompt = "out of the user's input prompt, generate a structured output that follows the given schema in json properly"
  const validatedResponse = await chatComplete({ prompt, validatorSchema, validatorSchemaName, systemPrompt })
  infoLogger({ status: "success", message: `valid data for ${validatorSchemaName} generated` })
  return validatedResponse
}

export const chatComplete = async<T extends z.ZodTypeAny>({ prompt, systemPrompt, validatorSchema, model = "gpt-4o-2", validatorSchemaName }: {
  prompt: string,
  systemPrompt: string,
  validatorSchema: T,
  model?: string
  validatorSchemaName: string,
}): Promise<z.infer<T>> => {
  try {
    const client = getOpenAIClient()
    const completion = await client.beta.chat.completions.parse({
      model: model,
      response_format: zodResponseFormat(validatorSchema, validatorSchemaName),
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
    const output = completion.choices[0].message.parsed
    return validatorSchema.parse(output)

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error", error.errors)
      throw new Error("Failed to validate AI response")
    }
    throw error
  }
}

export const createAllAssistants = async () => {
  const senseiiAssistants = Assistants
  const assistantList = await client.beta.assistants.list()
  const existingAssistants = assistantList.data.reduce((ids: IAssistant[], assistant: Assistant) => {
    ids.push({
      name: assistant.name as string,
      id: assistant.id
    })
    return ids
  }, [])

  senseiiAssistants.map(item => {
    createAssistant(item, existingAssistants)
  })
}
