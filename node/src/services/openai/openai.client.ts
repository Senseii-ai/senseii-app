import OpenAI from "openai";
const OpenAIAPIKey = process.env.OPENAI_API_KEY;

const openAIClient = new OpenAI({ apiKey: OpenAIAPIKey });

export const getOpenAIClient = (): OpenAI => {
  return openAIClient;
};
