const supportedAssistants = ["core", "fitness", "nutrition"];

const client = getOpenAIClient();

import { Response } from "express";
import { IAuthRequest } from "@middlewares/auth";
import { getCoreAssistantTools } from "../services/openai/assistants/core/assistant";
import getOpenAIClient from "@services/openai/client";
import chalk from "chalk";

// get the functions of the core assistant
export const getFunctions = async (req: IAuthRequest, res: Response) => {
  try {
    const assistantName = req.params.assistantId;
    if (supportedAssistants.includes(assistantName)) {
      const tools = await getCoreAssistantTools(client);
      return res.status(200).json({ tools: tools });
    }
  } catch (error) {
    console.error(chalk.red(error));
    throw error;
  }
};

// internal function
// TODO: Finish this
// export const _getAssistantants = async (req: Request, res: Response) => {
//   try {
//     const assistants =
//   } catch (error) {
//
//   }
// }
