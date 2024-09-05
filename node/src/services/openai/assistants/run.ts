// this file will handle the run related tasks and actions
import OpenAI, { AzureOpenAI } from "openai";
import { createMessage } from "./threads";
import {
  RequiredActionFunctionToolCall,
  Run,
  RunSubmitToolOutputsParams,
} from "openai/resources/beta/threads/runs/runs";
import { Message } from "openai/resources/beta/threads/messages";
import chalk from "chalk";
import { parseFunctionArguments } from "./utils";
import { getSupportedFunctions } from "./functions";

const runStatus = {
  QUEUED: "queued",
  CANCELLING: "cancelling",
  IN_PROGRESS: "in_progress",
  REQUIRES_ACTION: "requires_action",
  COMPLETED: "completed",
};

// create a run after adding a message into the thread
export const addMessageAndCreateRun = async (
  threadId: string,
  message: string,
  client: AzureOpenAI,
  assistantId: string,
) => {
  try {
    const addedMessage = await createMessage(message, client, threadId);
    const run = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    // TODO: implement responsePoller
    const messages = await responsePoller(run, client, threadId);
    if (!messages) {
      console.error("Error creating run", run);
      return;
    }
    if (messages.length > 0) {
      console.log(chalk.green("run succesful"));
      return messages;
    }
  } catch (error) {
    console.log(chalk.red("error adding message and creating run"));
    throw error;
  }
};

// createRun creates a run on a thread, expecting the message is already added to the thread.
export const createRun = async (
  threadId: string,
  client: OpenAI,
  assistantId: string,
) => {
  try {
    const run = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    // TODO: implement responsePoller
    const response = await responsePoller(run, client, threadId);
    if (!response) {
      console.error("Error creating run", run);
      return;
    }
    if (response.length > 0) {
      return response;
    }
  } catch (error) {
    console.log(chalk.red("error creating run"));
    throw error;
  }
};

// this function runs and aggregates the output of all the tools that are requried to be run.
export const runTools = async (tools: RequiredActionFunctionToolCall[]) => {
  try {
    const supportedFunctions = getSupportedFunctions();
    // an array of final output of each tool run
    const functionOutput: RunSubmitToolOutputsParams.ToolOutput[] = [];
    for (const tool of tools) {
      const functionName = tool.function.name;
      // TODO: Make it more typesafe.
      // TODO: Make it parallel using proper implementation of promises.
      if (functionName in supportedFunctions) {
        const functionTool = supportedFunctions[functionName];
        const functionArguments = tool.function.arguments;
        const parsedFunctionArguments = await parseFunctionArguments(
          functionArguments,
          functionTool,
        );
        const output = await functionTool.function(parsedFunctionArguments);
        const formattedOutput: RunSubmitToolOutputsParams.ToolOutput = {
          output: output,
          tool_call_id: tool.id,
        };
        functionOutput.push(formattedOutput);
      }
    }
    return functionOutput;
  } catch (error) {
    console.error(chalk.red("error running tools"));
    throw error;
  }
};

// responsePoller polls for response to be generated by the assistnat.
const responsePoller = async (
  run: Run,
  client: OpenAI,
  threadId: string,
): Promise<Message[] | null> => {
  try {
    const incompleteState = ["queued", "cancelling", "in_progress"];
    let messages: Message[] = [];
    while (incompleteState.includes(run.status)) {
      console.log("RUN STATUS", run.status);
      // wait for 1 second to poll again.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await client.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (run.status === "requires_action") {
      console.log("REQUIRES ACTION");
      // TODO: run tools
      // get an array of all the tool calls needed to be run in parallel.
      const toolsCalls = run.required_action?.submit_tool_outputs.tool_calls;
      if (!toolsCalls) {
        throw new Error("Tool calls could not be found");
      }
      console.log(chalk.green("reached here"));
      const output = await runTools(toolsCalls);
      run = await client.beta.threads.runs.submitToolOutputs(threadId, run.id, {
        tool_outputs: output,
      });
      console.log(chalk.black("tool output submitted"), run.status);

      const messages = await responsePoller(run, client, threadId);
      return messages;
    }

    // check if run is complete
    if (run.status === runStatus.COMPLETED) {
      messages = (await client.beta.threads.messages.list(threadId)).data;
      return messages;
    }
    return null;
  } catch (error) {
    console.log(chalk.red("error polling response"));
    throw error;
  }
};

// run function

// run tools
