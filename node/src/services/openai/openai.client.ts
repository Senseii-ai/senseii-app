import chalk from "chalk";
import { AzureOpenAI } from "openai";
const ApiKey = process.env.API_KEY;
const Endpoint = process.env.ENDPOINT;
const apiVersion = "2024-05-01-preview";

const openAIClient = new AzureOpenAI({
  endpoint: Endpoint,
  apiKey: ApiKey,
  apiVersion,
});

export const getOpenAIClient = (): AzureOpenAI => {
  return openAIClient;
};
