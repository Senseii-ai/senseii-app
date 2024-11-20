import { AssistantCreateParams, FunctionTool } from "openai/resources/beta/assistants"

export const CREATE_GOAL_FUNC: FunctionTool = {
  type: "function",
  function: {
    name: "create_goal",
    description:
      `Run this function when you are fully aware of the user's goals and necessary information like 
      goal name, description, preferences and startDate.
    `,
    parameters: {
      type: "object",
      required: ["goalName", "description", "preferences", "startDate"],
      properties: {
        goalName: {
          type: "string",
          description: "Name of the goal (e.g., 'Weight Loss Journey 2024')"
        },
        description: {
          type: "string",
          description: "Detailed description of what the user wants to achieve"
        },
        preferences: {
          type: "object",
          required: ["basicInformation", "lifeStyle", "dietPreferences", "healthGoals", "eatingHabits", "constraints"],
          properties: {
            basicInformation: {
              type: "object",
              required: ["age", "weight", "height", "gender"],
              properties: {
                age: {
                  type: "number",
                  description: "User's age in years"
                },
                weight: {
                  type: "object",
                  required: ["value", "unit"],
                  properties: {
                    value: { type: "number" },
                    unit: {
                      type: "string",
                      enum: ["Kilograms", "Grams", "Pounds"]
                    }
                  }
                },
                height: {
                  type: "object",
                  required: ["value", "unit"],
                  properties: {
                    value: { type: "number" },
                    unit: {
                      type: "string",
                      enum: ["Centimeters"]
                    }
                  }
                },
                gender: { type: "string" }
              }
            },
            lifeStyle: {
              type: "object",
              required: ["dailyRoutine", "exerciseRoutine"],
              properties: {
                dailyRoutine: {
                  type: "string",
                  enum: ["sedenatry", "light", "moderate", "heavy", "very heavy"]
                },
                exerciseRoutine: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["exerciseType", "frequency"],
                    properties: {
                      exerciseType: {
                        type: "string",
                        enum: ["cardio", "strength", "flexibility", "balance", "none"]
                      },
                      frequency: {
                        type: "string",
                        enum: ["daily", "weekly", "monthly"]
                      }
                    }
                  }
                }
              }
            },
            dietPreferences: {
              type: "object",
              required: ["preference", "allergies", "intolerances"],
              properties: {
                preference: {
                  type: "string",
                  enum: ["vegetarian", "non-vegetarian", "vegan", "pescatarian", "omnivore", "ketogenic", "paleo"]
                },
                allergies: {
                  type: "array",
                  items: { type: "string" }
                },
                intolerances: {
                  type: "array",
                  items: { type: "string" }
                },
                dislikedFood: {
                  type: "array",
                  items: { type: "string" }
                },
                favouriteFood: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            healthGoals: {
              type: "object",
              required: ["specificNutritionGoal", "medicalConditions"],
              properties: {
                weightGoal: {
                  type: "string",
                  enum: ["gain", "loss", "maintain"]
                },
                specificNutritionGoal: { type: "string" },
                medicalConditions: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            eatingHabits: {
              type: "object",
              required: ["mealsPerDay", "mealComplexity", "cookingTime"],
              properties: {
                mealsPerDay: { type: "number" },
                mealComplexity: {
                  type: "string",
                  enum: ["simple", "moderate", "complex"]
                },
                cookingTime: {
                  type: "string",
                  enum: ["less than 30 minutes", "30-60 minutes", "more than 60 minutes"]
                }
              }
            },
            constraints: {
              type: "object",
              required: ["financial", "geographical"],
              properties: {
                financial: {
                  type: "object",
                  required: ["budget", "budgetType"],
                  properties: {
                    budget: { type: "number" },
                    budgetType: {
                      type: "string",
                      enum: ["daily", "weekly", "monthly"]
                    }
                  }
                },
                geographical: {
                  type: "object",
                  required: ["location"],
                  properties: {
                    location: { type: "string" }
                  }
                }
              }
            }
          }
        },
        startDate: {
          type: "string",
          format: "date",
          description: "Start date for the goal (ISO 8601 format)"
        },
        endDate: {
          type: "string",
          format: "date",
          description: "Optional end date for the goal (ISO 8601 format)"
        }
      }
    }
  }
}

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

    The diet plan is tailored based on the provided information.`,
    parameters: {
      type: "object",
      properties: {
        basicInformation: {
          type: "object",
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
              description: "user daily routine, allowed types 'sedentary', 'light', 'moderate', 'heavy', 'very heavy'"
            },
            exerciseRoutine: {
              type: "object",
              properties: {
                exerciseType: {
                  type: "string",
                  "description": "user exercise type, allowed types 'cardio', 'strength', 'flexibility', 'balance', 'none'"
                },
                frequency: {
                  type: "string",
                  description: "user exercise frequency, allowed types 'daily', 'weekly', 'monthly'"
                }
              },
              required: [
                "exerciseType",
                "frequency"
              ]
            }
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
              description: "user weight goal, allowed types 'gain', 'loss', 'maintain'"
            },
            specificNutritionGoal: {
              type: "string",
              description: "user nutrition goal"
            },
            medicalConditions: {
              type: "array",
              items: {
                type: "string"
              },
              description: "user medical conditions"
            }
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
          required: [
            "mealsPerDay",
            "mealComplexity",
            "cookingTime"
          ]
        },
        constraints: {
          type: "object",
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
          required: [
            "financial",
            "geographical"
          ]
        }
      },
      required: [
        "basicInformation",
        "lifeStyle",
        "dietPreferences",
        "healthGoals",
        "eatingHabits",
        "constraints"
      ]
    }
  }
}

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
    - You do not make diet plans for the user
      - You do not make workout plans for the user
        - you do not take dis - respect from the user and do not apologise.
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
  tools: [CREATE_NUTRITION_FUNC, CREATE_GOAL_FUNC],
  model: "gpt-4o",
}


