import chalk from "chalk";
import { getOpenAIClient } from "../openai.client";
import { IFunctionType } from "./functions";
import { ICreateNutritionPlanArguments } from "../../../types/user/nutritionPlan";
import { Message } from "openai/resources/beta/threads/messages";
import { Assistants } from "./constants";
import { Assistant, AssistantCreateParams } from "openai/resources/beta/assistants";
import { infoLogger } from "../../../utils/logger/logger";
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod";

let client = getOpenAIClient()

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
    infoLogger({ status: "success", message: `name: ${createdAssistant.name} Assistant ID: ${createdAssistant.id}` })
  }
}

const testing = {
  "plan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Oats with Milk",
          "macros": {
            "protein": 12,
            "dietryFat": 5,
            "carbohydrates": 50,
            "water": 300
          },
          "micros": {
            "vitamins": 2,
            "dietryMinerals": 10
          },
          "calories": 350,
          "items": [
            {
              "item": "Rolled Oats",
              "proportion": 80,
              "unit": "grams"
            },
            {
              "item": "Milk",
              "proportion": 200,
              "unit": "ml"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Chicken Curry with Rice",
          "macros": {
            "protein": 30,
            "dietryFat": 15,
            "carbohydrates": 60,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 8
          },
          "calories": 600,
          "items": [
            {
              "item": "Chicken",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Curry Sauce",
              "proportion": 50,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Vegetable Stir-fry with Quinoa",
          "macros": {
            "protein": 18,
            "dietryFat": 10,
            "carbohydrates": 45,
            "water": 250
          },
          "micros": {
            "vitamins": 4,
            "dietryMinerals": 6
          },
          "calories": 500,
          "items": [
            {
              "item": "Quinoa",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Mixed Vegetables",
              "proportion": 150,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Fruit Salad",
          "macros": {
            "protein": 2,
            "dietryFat": 1,
            "carbohydrates": 30,
            "water": 100
          },
          "micros": {
            "vitamins": 5,
            "dietryMinerals": 4
          },
          "calories": 150,
          "items": [
            {
              "item": "Mixed Fruits",
              "proportion": 150,
              "unit": "grams"
            }
          ]
        }
      ]
    },
    {
      "day": "Tuesday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Egg Omelette with Toast",
          "macros": {
            "protein": 20,
            "dietryFat": 12,
            "carbohydrates": 30,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 7
          },
          "calories": 400,
          "items": [
            {
              "item": "Eggs",
              "proportion": 3,
              "unit": "count"
            },
            {
              "item": "Whole Wheat Bread",
              "proportion": 2,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Fish Curry with Chapati",
          "macros": {
            "protein": 30,
            "dietryFat": 15,
            "carbohydrates": 55,
            "water": 200
          },
          "micros": {
            "vitamins": 2,
            "dietryMinerals": 8
          },
          "calories": 600,
          "items": [
            {
              "item": "Fish",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Chapati",
              "proportion": 2,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Chicken Salad with Dressing",
          "macros": {
            "protein": 25,
            "dietryFat": 13,
            "carbohydrates": 20,
            "water": 200
          },
          "micros": {
            "vitamins": 5,
            "dietryMinerals": 5
          },
          "calories": 450,
          "items": [
            {
              "item": "Chicken Breast",
              "proportion": 125,
              "unit": "grams"
            },
            {
              "item": "Salad Greens",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Salad Dressing",
              "proportion": 30,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Nuts Mix",
          "macros": {
            "protein": 6,
            "dietryFat": 15,
            "carbohydrates": 8,
            "water": 50
          },
          "micros": {
            "vitamins": 1,
            "dietryMinerals": 3
          },
          "calories": 180,
          "items": [
            {
              "item": "Mixed Nuts",
              "proportion": 30,
              "unit": "grams"
            }
          ]
        }
      ]
    },
    {
      "day": "Wednesday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Smoothie with Protein Powder",
          "macros": {
            "protein": 30,
            "dietryFat": 8,
            "carbohydrates": 48,
            "water": 400
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 4
          },
          "calories": 400,
          "items": [
            {
              "item": "Banana",
              "proportion": 1,
              "unit": "count"
            },
            {
              "item": "Protein Powder",
              "proportion": 30,
              "unit": "grams"
            },
            {
              "item": "Yogurt",
              "proportion": 100,
              "unit": "ml"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Prawn Curry with Rice",
          "macros": {
            "protein": 28,
            "dietryFat": 16,
            "carbohydrates": 55,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 9
          },
          "calories": 640,
          "items": [
            {
              "item": "Prawns",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Curry Sauce",
              "proportion": 50,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Vegetable Biryani",
          "macros": {
            "protein": 15,
            "dietryFat": 10,
            "carbohydrates": 60,
            "water": 250
          },
          "micros": {
            "vitamins": 6,
            "dietryMinerals": 7
          },
          "calories": 500,
          "items": [
            {
              "item": "Basmati Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Mixed Vegetables",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Biryani Spices",
              "proportion": 10,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Yogurt",
          "macros": {
            "protein": 6,
            "dietryFat": 5,
            "carbohydrates": 8,
            "water": 150
          },
          "micros": {
            "vitamins": 1,
            "dietryMinerals": 3
          },
          "calories": 100,
          "items": [
            {
              "item": "Low-Fat Yogurt",
              "proportion": 150,
              "unit": "ml"
            }
          ]
        }
      ]
    },
    {
      "day": "Thursday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Chia Pudding",
          "macros": {
            "protein": 10,
            "dietryFat": 7,
            "carbohydrates": 35,
            "water": 250
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 5
          },
          "calories": 300,
          "items": [
            {
              "item": "Chia Seeds",
              "proportion": 30,
              "unit": "grams"
            },
            {
              "item": "Almond Milk",
              "proportion": 200,
              "unit": "ml"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Lentil Soup with Bread",
          "macros": {
            "protein": 22,
            "dietryFat": 5,
            "carbohydrates": 50,
            "water": 200
          },
          "micros": {
            "vitamins": 4,
            "dietryMinerals": 6
          },
          "calories": 400,
          "items": [
            {
              "item": "Lentils",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Whole Wheat Bread",
              "proportion": 2,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Chicken Tikka with Roti",
          "macros": {
            "protein": 35,
            "dietryFat": 20,
            "carbohydrates": 50,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 10
          },
          "calories": 700,
          "items": [
            {
              "item": "Chicken Tikka",
              "proportion": 200,
              "unit": "grams"
            },
            {
              "item": "Roti",
              "proportion": 2,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Cucumber Sticks with Hummus",
          "macros": {
            "protein": 4,
            "dietryFat": 6,
            "carbohydrates": 12,
            "water": 100
          },
          "micros": {
            "vitamins": 2,
            "dietryMinerals": 2
          },
          "calories": 150,
          "items": [
            {
              "item": "Cucumber",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Hummus",
              "proportion": 30,
              "unit": "grams"
            }
          ]
        }
      ]
    },
    {
      "day": "Friday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Egg and Avocado Toast",
          "macros": {
            "protein": 24,
            "dietryFat": 15,
            "carbohydrates": 30,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 7
          },
          "calories": 450,
          "items": [
            {
              "item": "Eggs",
              "proportion": 2,
              "unit": "count"
            },
            {
              "item": "Avocado",
              "proportion": 50,
              "unit": "grams"
            },
            {
              "item": "Whole Wheat Bread",
              "proportion": 1,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Mutton Rogan Josh with Rice",
          "macros": {
            "protein": 35,
            "dietryFat": 22,
            "carbohydrates": 60,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 10
          },
          "calories": 800,
          "items": [
            {
              "item": "Mutton",
              "proportion": 200,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Rogan Josh Sauce",
              "proportion": 50,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Paneer Tikka with Roti",
          "macros": {
            "protein": 30,
            "dietryFat": 15,
            "carbohydrates": 45,
            "water": 200
          },
          "micros": {
            "vitamins": 5,
            "dietryMinerals": 8
          },
          "calories": 600,
          "items": [
            {
              "item": "Paneer",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Roti",
              "proportion": 2,
              "unit": "count"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Popcorn",
          "macros": {
            "protein": 6,
            "dietryFat": 2,
            "carbohydrates": 30,
            "water": 50
          },
          "micros": {
            "vitamins": 1,
            "dietryMinerals": 2
          },
          "calories": 180,
          "items": [
            {
              "item": "Air-Popped Popcorn",
              "proportion": 25,
              "unit": "grams"
            }
          ]
        }
      ]
    },
    {
      "day": "Saturday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Whole Grain Cereal with Milk",
          "macros": {
            "protein": 10,
            "dietryFat": 5,
            "carbohydrates": 60,
            "water": 250
          },
          "micros": {
            "vitamins": 2,
            "dietryMinerals": 5
          },
          "calories": 350,
          "items": [
            {
              "item": "Whole Grain Cereal",
              "proportion": 80,
              "unit": "grams"
            },
            {
              "item": "Milk",
              "proportion": 200,
              "unit": "ml"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Palak Paneer with Rice",
          "macros": {
            "protein": 18,
            "dietryFat": 20,
            "carbohydrates": 55,
            "water": 200
          },
          "micros": {
            "vitamins": 4,
            "dietryMinerals": 6
          },
          "calories": 600,
          "items": [
            {
              "item": "Paneer",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Spinach",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Chicken Fried Rice",
          "macros": {
            "protein": 25,
            "dietryFat": 10,
            "carbohydrates": 60,
            "water": 200
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 6
          },
          "calories": 600,
          "items": [
            {
              "item": "Chicken",
              "proportion": 150,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Mixed Vegetables",
              "proportion": 100,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Fruit Smoothie",
          "macros": {
            "protein": 4,
            "dietryFat": 2,
            "carbohydrates": 30,
            "water": 300
          },
          "micros": {
            "vitamins": 5,
            "dietryMinerals": 4
          },
          "calories": 120,
          "items": [
            {
              "item": "Banana",
              "proportion": 1,
              "unit": "count"
            },
            {
              "item": "Berries",
              "proportion": 100,
              "unit": "grams"
            }
          ]
        }
      ]
    },
    {
      "day": "Sunday",
      "meals": [
        {
          "type": "Breakfast",
          "food": "Pancakes with Honey",
          "macros": {
            "protein": 12,
            "dietryFat": 8,
            "carbohydrates": 55,
            "water": 250
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 5
          },
          "calories": 400,
          "items": [
            {
              "item": "Pancake Mix",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Honey",
              "proportion": 15,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Lunch",
          "food": "Chickpea Salad with Rice",
          "macros": {
            "protein": 20,
            "dietryFat": 5,
            "carbohydrates": 60,
            "water": 200
          },
          "micros": {
            "vitamins": 4,
            "dietryMinerals": 6
          },
          "calories": 500,
          "items": [
            {
              "item": "Chickpeas",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Rice",
              "proportion": 100,
              "unit": "grams"
            },
            {
              "item": "Salad Vegetables",
              "proportion": 100,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Dinner",
          "food": "Grilled Fish with Veggies",
          "macros": {
            "protein": 35,
            "dietryFat": 12,
            "carbohydrates": 40,
            "water": 300
          },
          "micros": {
            "vitamins": 3,
            "dietryMinerals": 5
          },
          "calories": 600,
          "items": [
            {
              "item": "Fish",
              "proportion": 200,
              "unit": "grams"
            },
            {
              "item": "Steamed Vegetables",
              "proportion": 150,
              "unit": "grams"
            }
          ]
        },
        {
          "type": "Snacks",
          "food": "Almonds",
          "macros": {
            "protein": 6,
            "dietryFat": 13,
            "carbohydrates": 6,
            "water": 50
          },
          "micros": {
            "vitamins": 1,
            "dietryMinerals": 3
          },
          "calories": 150,
          "items": [
            {
              "item": "Almonds",
              "proportion": 20,
              "unit": "grams"
            }
          ]
        }
      ]
    }
  ]
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
