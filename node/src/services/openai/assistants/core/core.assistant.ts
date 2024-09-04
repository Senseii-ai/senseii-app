import { AzureOpenAI } from "openai";
import { CoreAssistantId } from "../constants";
import { AssistantTool, FunctionTool } from "openai/resources/beta/assistants";

// getSummaryAssistantId fetches and returns the summary assistant from environment vairables.
export const getCoreAssistantId = (): string => {
  const assistantId = CoreAssistantId;
  if (typeof assistantId !== "string" || assistantId.length <= 0) {
    throw new Error("Core Assistnat Id not set");
  }
  return assistantId;
};

// getCoreAssistant returns the core assistant using the coreAssistant ID.
export const getCoreAssistant = async (client: AzureOpenAI) => {
  const assistantId = CoreAssistantId;
  if (typeof assistantId !== "string" || assistantId.length <= 0) {
    throw new Error("Core Assistnat Id not set");
  }
  const coreAssistant = await client.beta.assistants.retrieve(assistantId);
  return coreAssistant;
};

// getCoreAssistantTools returns the tools used by the core assistant, it returns an array of tools, which is empty if the no tools are present
export const getCoreAssistantTools = async (
  client: AzureOpenAI,
): Promise<AssistantTool[]> => {
  const coreAssistant = await getCoreAssistant(client);
  const tools = coreAssistant.tools;
  return tools;
};

// getCoreAssistantFunctions returns functions that are type of functions.
export const getCoreAssistantFunctions = async (
  client: AzureOpenAI,
): Promise<FunctionTool[]> => {
  const tools = await getCoreAssistantTools(client);
  const functions = tools.filter(
    (tool): tool is FunctionTool => tool.type === "function",
  );
  return functions;
};

// returns an empty array if the assistant has no tools.
export const getCoreAssistantFunctionNames = async (
  client: AzureOpenAI,
): Promise<string[]> => {
  const functions = await getCoreAssistantFunctions(client);
  const functionNames = functions.map((funct) => funct.function.name);
  return functionNames;
};
