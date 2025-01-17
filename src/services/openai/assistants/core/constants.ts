import { AssistantCreateParams, FunctionTool } from "openai/resources/beta/assistants"

export const CREATE_INITIAL_GOAL_FUNC: FunctionTool = {
  type: "function",
  function: {
    name: "create_initial_goal",
    description:
      `Run this function when the user defines their health or fitness related goal.
      It is the initial goal when the user hasn't provided any major information except
      the initial basic definition of the goal. The information should include these:
        - weightGoal
        - specificNutritionGoal
      `,
    parameters: {
      type: "object",
      required: ["goalName", "description", "startDate", "weightGoal", "specificNutritionGoal"],
      properties: {
        goalName: {
          type: "string",
          description: "Name of the goal (e.g., 'Weight Loss Journey 2024')"
        },
        description: {
          type: "string",
          description: "Detailed description of what the user wants to achieve"
        },
        endDate: {
          type: "string",
          description: "Does user provide any deadline to when they want to achieve their goal"
        },
        healthGoals: {
          type: "object",
          required: [
            "weightGoal",
            "specificNutritionGoal",
          ],
          properties: {
            weightGoal: {
              type: "string",
              description: "user weight goal, allowed types 'gain', 'loss', 'maintain'"
            },
            specificNutritionGoal: {
              type: "string",
              description: "user nutrition goal"
            },
          },
        }
      }
    }
  }
}

export const UPDATE_USER_BASIC_INFORMATION: FunctionTool = {
  type: "function",
  function: {
    name: "update_user_basic_information",
    description:
      `Run this function when the user provides all the basic information about them, things that
      should definitely include:
        - age,
        - height,
        - weight,
        - gender,
      `,
    parameters: {
      type: "object",
      required: ["basicInformation"],
      properties: {
        basicInformation: {
          type: "object",
          required: [
            "age",
            "weight",
            "height",
            "gender"
          ],
          properties: {
            age: {
              type: "number",
              description: "user age"
            },
            weight: {
              type: "number",
              description: "user weight"
            },
            height: {
              type: "number",
              description: "user height"
            },
            gender: {
              type: "string",
              description: "user gender"
            }
          },
        }
      },
    }
  }
}

export const UPDATE_USER_DIET_PREFERENCES: FunctionTool = {
  type: "function",
  function: {
    name: "update_user_diet_preferences",
    description:
      `Run this function when users suggests any changes in their diet preferences. The diet information
      includes the following information:
        - food preferences,
        - allergies,
        - intolerances,
        - dislikedFood
        - favouriteFood`,
    parameters: {
      type: "object",
      required: ["dietPreferences"],
      properties: {
        dietPreferences: {
          type: "object",
          "required": [
            "preference",
            "allergies",
            "intolerances",
            "dislikedFood",
            "favouriteFood"
          ],
          properties: {
            preference: {
              type: "string",
              description: "user diet preference, allowed types 'vegetarian', 'non-vegetarian', 'vegan', 'pescatarian', 'omnivore', 'ketogenic', 'paleo'"
            },
            allergies: {
              type: "array",
              items: {
                type: "string"
              },
              description: "user allergies"
            },
            intolerances: {
              type: "array",
              items: {
                type: "string"
              },
              description: "user intolerances for food"
            },
            dislikedFood: {
              type: "array",
              items: {
                type: "string"
              },
              description: "user dislikes"
            },
            favouriteFood: {
              type: "array",
              items: {
                type: "string"
              },
              description: "user likings"
            }
          },
        }
      }
    }
  }
}

export const UPDATE_EATING_HABITS: FunctionTool = {
  type: "function",
  function: {
    name: "update_eating_habits",
    description:
      `Run this funciton when the user wants to update their eating habits. This includes
      the following information:
        - mealsPerDay,
        - mealComplexity,
        - cookingTime,
      `,
    parameters: {
      type: "object",
      required: ["eatingHabits"],
      properties: {
        eatingHabits: {
          type: "object",
          required: [
            "mealsPerDay",
            "mealComplexity",
            "cookingTime"
          ],
          properties: {
            mealsPerDay: {
              type: "number",
              description: "The number of meals that the user has per day"
            },
            mealComplexity: {
              type: "string",
              description: "meal complexity, allowed types 'simple', 'moderate', 'complex'"
            },
            cookingTime: {
              type: "string",
              description: "meal cooking type, allowed types 'less than 30 minutes', '30-60 minutes', 'more than 60 minutes'"
            }
          },
        }
      },
    }
  },
}

export const UPDATE_CONSTRAINTS: FunctionTool = {
  type: "function",
  function: {
    name: "update-user-constraints",
    description:
      `Run this funciton when user provides any of the following constraints:
        - fincancial
        - location`,
    parameters: {
      type: "object",
      required: ["constraints"],
      constraints: {
        type: "object",
        required: [
          "financial",
          "geographical"
        ],
        properties: {
          financial: {
            type: "object",
            properties: {
              budget: {
                type: "number",
                description: "The user's budget"
              },
              budgetType: {
                type: "string",
                description: "user budget frequency, allowed types 'daily', 'weekly', 'monthly'"
              }
            },
            required: [
              "budget",
              "budgetType"
            ]
          },
          geographical: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "user's country"
              }
            },
            required: [
              "location"
            ]
          }
        },

      }
    }
  }
}

// CREATE_NUTRITION_FUNC is called when all the necessary information is available in the thread.
export const CREATE_NUTRITION_FUNC: FunctionTool = {
  type: "function",
  function: {
    name: "create_nutrition_plan",
    description: `Creates a nutrition plan for the user when the assistant has
    Necessary information:
    - basicInformation: Age, weight, height, gender [all required].
      - lifestyle: Daily routine, exercise routine [all required], daily routine [optional].
      - dietPreferences: Preferences, allergies [required], intolerances, disliked, and favorite foods.        
      - healthGoals: Weight goal, nutrition goal, medical conditions [all required].
      - eatingHabits: Meals per day [required], meal complexity, cooking time [optional].
      - constraints: Financial [required], geographical [optional].

    The diet plan is tailored based on the provided information. In case any field is empty, it should be 
    the JSON equivalent null value. But the arguments should strictly follow the function schema`,
    parameters: {
      type: "object",
      required: [
        "basicInformation",
        "lifeStyle",
        "dietPreferences",
        "healthGoals",
        "eatingHabits",
        "constraints"
      ],
      properties: {
        basicInformation: {
          type: "object",
          properties: {
            age: { type: "number", description: "Age of the user" },
            weight: {
              type: "object",
              properties: {
                value: { type: "number", description: "User's weight" },
                unit: {
                  type: "string",
                  enum: ["Kilograms", "Grams", "Pounds"],
                  description: "Weight unit (Kilograms, Grams, or Pounds)",
                },
              },
            },
            height: {
              type: "object",
              properties: {
                value: { type: "number", description: "User's height" },
                unit: {
                  type: "string",
                  enum: ["Centimeters"],
                  description: "Height unit (Centimeters)",
                },
              },
            },
            gender: { type: "string", description: "Gender of the user" },
          },
          required: [
            "age",
            "weight",
            "height",
            "gender"
          ]
        },
        lifeStyle: {
          type: "object",
          properties: {
            dailyRoutine: {
              type: "string",
              enum: ["sedentary", "light", "moderate", "heavy", "very heavy"],
              description: "User's daily routine activity level",
            },
            exerciseRoutine: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  exerciseType: {
                    type: "string",
                    enum: ["cardio", "strength", "flexibility", "balance", "none"],
                    description: "Type of exercise the user performs",
                  },
                  frequency: {
                    type: "string",
                    enum: ["daily", "weekly", "monthly"],
                    description: "Frequency of the exercise",
                  },

                },

              },
              required: [
                "exerciseType",
                "frequency"
              ],
            },

          },
          required: [
            "dailyRoutine",
            "exerciseRoutine"
          ]
        },
        dietPreferences: {
          type: "object",
          properties: {
            preference: {
              type: "string",
              enum: [
                "vegetarian",
                "non-vegetarian",
                "vegan",
                "pescatarian",
                "omnivore",
                "ketogenic",
                "paleo",
              ],
              description: "User's dietary preference",
            },
            allergies: {
              type: "array",
              items: { type: "string" },
              description: "List of user's allergies",
            },
            intolerances: {
              type: "array",
              items: { type: "string" },
              description: "List of user's intolerances",
            },
            dislikedFood: {
              type: "array",
              items: { type: "string" },
              description: "List of food the user dislikes",
            },
            favouriteFood: {
              type: "array",
              items: { type: "string" },
              description: "List of food the user likes",
            },
          },
          required: [
            "preference",
            "allergies",
            "intolerances",
            "dislikedFood",
            "favouriteFood"
          ]
        },
        healthGoals: {
          type: "object",
          properties: {
            weightGoal: {
              type: "string",
              enum: ["gain", "loss", "maintain"],
              description: "User's weight goal",
            },
            specificNutritionGoal: {
              type: "string",
              description: "User's specific nutrition goal",
            },
            medicalConditions: {
              type: "array",
              items: { type: "string" },
              description: "List of medical conditions the user has",
            },
          },
          required: [
            "weightGoal",
            "specificNutritionGoal",
            "medicalConditions"
          ]
        },
        eatingHabits: {
          type: "object",
          properties: {
            mealsPerDay: {
              type: "number",
              description: "Number of meals the user has per day",
            },
            mealComplexity: {
              type: "string",
              enum: ["simple", "moderate", "complex"],
              description: "Complexity of the meals the user prefers",
            },
            cookingTime: {
              type: "string",
              enum: [
                "less than 30 minutes",
                "30-60 minutes",
                "more than 60 minutes",
              ],
              description: "Cooking time the user prefers",
            },
          },
          required: [
            "mealsPerDay",
            "mealComplexity",
            "cookingTime"
          ]
        },
        constraints: {
          type: "object",
          required: [
            "financial",
            "geographical"
          ],
          properties: {
            financial: {
              type: "object",
              properties: {
                budget: { type: "number", description: "User's budget" },
                budgetType: {
                  type: "string",
                  enum: ["daily", "weekly", "monthly"],
                  description: "Budget frequency",
                },
              },
              required: [
                "budget",
                "budgetType"
              ]
            },
            geographical: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "what country is the user from",
                },
              },
            },
          },
        },

      },
    }
  }
}

export const coreFunctions = [CREATE_INITIAL_GOAL_FUNC, UPDATE_USER_BASIC_INFORMATION, UPDATE_EATING_HABITS, UPDATE_USER_DIET_PREFERENCES, CREATE_NUTRITION_FUNC]

export const CORE_ASSISTANT: AssistantCreateParams = {
  name: "core-assistant",
  instructions:
    `You are a part of a multi agent system, the goal of the system is to help
    the user's achieve their goals in a progressive way, by breaking them down
    into smaller pieces and then working on them daily, weekly, monthly etc.
    Current goal of the system is to focus on fitness related goals.You are a
    senseii but do not have a name, you are a helpful teacher, you have a persona
    of a japanese senseii, that is very humane and talks less, but when you talk,
    you talk with authority and confidence.the other assistants have their own
    mastery, one is a master nutritionist and another is a master trainer.All
    three of you work together to help the user achieve their fitness goals.
    
    Only you talk to the user and just like a confident, serious and wise
    teacher would give the user that experience, all the other agents are your
    assistant, it is your responsibility to talk to the user and get the necessary
    information from them, so that your assistants have enough information to work
    with.Nutritionist agent is respoinsbile for making diet plans for the user and
    trainer agent is responsible for making workout plans for the user.You are a
    master with wisdom and knowledge.

    
    You are responsbile for the following:
      - Having normal conversation with the user as a teacher.
      - helping them define their goals
      - Onboarding the user into the self improvment when they show interest
      - Getting the necessary information from the user
      - Teaching the user while helping them achieve their goals
      - You sound human and totally into the character of a japanese senseii 
      - Once others generate the plans, you just summarise them in form of markdown tables.

    What you do not do:
      - You speak less, and explain when the user doesn't understand something.
      - You do not make any plans for the user
      - you do not take disrespect from the user and do not apologise.
      - you do not talk to the user too much about anything outside of fitness and self improvement

    Every time a Meal plan is generated you create a summary you create after Nutrition assistant
    generated the original plan should be in markdown table, only for three days
    tags, in the format:

    - Columns:
      - Day: The day of the week.
        - Meal: The meal type(Breakfast, Lunch, Dinner).
        - Food: Description of the meal.
        - Calories: Total calories for the meal.
        - Macros: Combined macro - nutrient values(Protein, Fat, Carbohydrates, Water) in one column.
        - Micros: Combined micro - nutrient values(Vitamins, Minerals) in one column.
        - Items: A list of individual food items, with their proportions and units.]
    - Formatting: Days are bolded for emphasis.
    - Structure: Clear separation of meals under each day for easier meal tracking.

    If user suggests any changes to any type of plan, the related function calls should be made
    with updated user preferences.`,
  tools: coreFunctions,
  model: "gpt-4o",
}
