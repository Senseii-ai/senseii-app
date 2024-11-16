import chalk from "chalk";
import { getOpenAIClient } from "../openai.client";
import { IFunctionType } from "./functions";
import { ICreateNutritionPlanArguments } from "../../../types/user/nutritionPlan";
import { Message } from "openai/resources/beta/threads/messages";
import { Assistants } from "./constants";
import { Assistant, AssistantCreateParams } from "openai/resources/beta/assistants";
import { json } from "stream/consumers";
import { infoLogger } from "../../../utils/logger/logger";

const client = getOpenAIClient()

// parameter parser.
// TODO: locally store the functions supported by each assistant.
// TODO: implement Function argument interface and type for each assistant.
// TODO: implement the parsing function of each assistant tool

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
    infoLogger({ status: "success", message: `Assistant ID: ${createdAssistant.id}` })
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
