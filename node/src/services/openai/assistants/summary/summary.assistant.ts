import { AzureOpenAI } from "openai";
import { SummaryAssistantId } from "../constants";
import { AssistantTool, FunctionTool } from "openai/resources/beta/assistants";

// getSummaryAssistantId fetches and returns the core assistantId from environment vairables.
export const getSummaryAssistantId = (): string => {
  const assistantId = SummaryAssistantId;
  if (typeof assistantId !== "string" || assistantId.length <= 0) {
    throw new Error("Summary Assistnat Id not set");
  }
  return assistantId;
};

// getCoreAssistant returns the core assistant using the coreAssistant ID.
export const getSummaryAssistant = async (client: AzureOpenAI) => {
  try {
    const assistantId = getSummaryAssistantId();
    const assistant = await client.beta.assistants.retrieve(assistantId);
    return assistant;
  } catch (error) {
    console.error("Error getting Summary Assistant", error);
  }
};

// getCoreAssistantTools returns the tools used by the core assistant, it returns an array of tools, which is empty if the no tools are present
export const getSummaryAssistantTools = async (
  client: AzureOpenAI,
): Promise<AssistantTool[] | null> => {
  const assistant = await getSummaryAssistant(client);
  const tools = assistant?.tools;
  if (!tools) {
    return null;
  }
  return tools;
};

export const createSummaryAssistant = async (client: AzureOpenAI) => {
  const assistant = await client.beta.assistants.create({
    model: "gpt-4o",
    name: "Summariser",
    description: "Utility assistant to summarise threads",
    instructions: `You are a helpful assistant that reads all the chats in the thread and gives a very small topic of what the entire conversation about`,
  });
  return assistant;
};

// getSummaryAssistantFunctions returns functions that are type of functions.
// export const getSummaryAssistantFunctions = async (
//   client: AzureOpenAI,
// ): Promise<FunctionTool[]> => {
//   const tools = await getSummaryAssistant(client);
//   const functions = tools?.filter(
//     (tool): tool is FunctionTool => tool.type === "function",
//   );
//   return functions;
// };
//
// returns an empty array if the assistant has no tools.
// export const getCoreAssistantFunctionNames = async (
//   client: OpenAI,
// ): Promise<string[]> => {
//   const functions = await getCoreAssistantFunctions(client);
//   const functionNames = functions.map((funct) => funct.function.name);
//   return functionNames;
// };
