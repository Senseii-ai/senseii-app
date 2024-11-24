import { AzureOpenAI } from "openai";
const ApiKey = process.env.AZURE_OPENAI_API_KEY;
const Endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = process.env.API_VERSION;

const openAIClient = new AzureOpenAI({
  endpoint: Endpoint,
  apiKey: ApiKey,
  apiVersion,
});

export default function getOpenAIClient() {
  return openAIClient;
};
