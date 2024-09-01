import { AzureOpenAI } from "openai";

const endpoint = "https://senseii-dev.openai.azure.com/";
const apiKey = "5f09499b115e401d8fff29ca2026aa3b";
const apiVersion = "2024-05-01-preview";

const openAIClient = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion,
});

import OpenAI from "openai";
// const OpenAIAPIKey = process.env.OPENAI_API_KEY;

export const getOpenAIClient = (): AzureOpenAI => {
  return openAIClient;
};
