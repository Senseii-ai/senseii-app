import OpenAI from "openai"

// getNutritionAssistantId returns the Nutrition Assistant ID from the environment variables.
export const getNutritionAssistantId = (): string => {
  const assistantId = process.env.NUTRITION_ASSISTANT
  if (typeof assistantId !== "string" || assistantId.length <= 0) {
    throw new Error("Nutrition Assistnat Id not set")
  }
  return assistantId
}

// getNutritionAssistant returns the Nutrition Assistant from the OpenAI API.
export const getNutritionAssistant = async (client: OpenAI) => {
  const assistantId = getNutritionAssistantId()
  const nutritionAssistant = await client.beta.assistants.retrieve(assistantId)
  return nutritionAssistant
}
