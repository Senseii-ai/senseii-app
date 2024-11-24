import chalk from "chalk";
import getOpenAIClient from "@services/openai/client"
import { IFunctionType } from "@services/openai/assistants";
import { ICreateNutritionPlanArguments } from "@senseii/types"
import { Message } from "openai/resources/beta/threads/messages";
import { Assistants } from "@services/openai/assistants";
import { Assistant, AssistantCreateParams } from "openai/resources/beta/assistants";
import { infoLogger } from "@utils/logger";
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod";

let client = getOpenAIClient()

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
