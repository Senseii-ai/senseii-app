import { AssistantCreateParams, FunctionTool } from "openai/resources/beta/assistants"

export const CALCULATE_METRICS: FunctionTool = {
  type: "function",
  function: {
    name: "calculate_metrics",
    description:
      `Run this function when the following functions have been run:
- create_initial_goal, update_basic_information, update_eating_habits, update_user_diet_preferences, update_constraints otherwise the system will FAIL`
  }
}

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
          description: "The weekly numerical representation deadline of the goal. If the user provides any deadline to when they want to achieve their goal, For example, if they suggest '3 months from now', the value should be 12."
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
              description: "user weight goal, allowed enums 'gain', 'loss', 'maintain'"
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
              description: "user weight, value along with unit. example: 10 Kilograms"
            },
            height: {
              type: "number",
              description: "user height, value along with unit, example: 180 Centimeters"
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
      `Run this funciton when the user has provided all the information needed to update their eating habits. This includes
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
    name: "update_constraints",
    description:
      `Run this funciton when user provides any of the following constraints:
        - fincancial
        - location`,
    parameters: {
      type: "object",
      required: ["constraints"],
      properties: {
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

// - For workouts: Call \`generate_workout_plan\`. Summarize as:
//      \`\`\`markdown
//      **Day 1: Strength**  
//      - 3x5 Deadlifts (Progressively heavier)  
//      - 3x8 Pull-Ups (Full range of motion)  
//      \`\`\`
//
//
//
//4. **Validation & Safety**:
//    - Use \`validate_meal_plan\` to ensure calorie targets are met. If failed: "The Nutritionist has erred. They will correct this."
//    - If BMI >30: "A warrior knows their limits. Consult a doctor before beginning." The scope being you know limit of your capabilities,
// if you feel like something is too risky you tell them, to avoid liability.
//


export const coreFunctions = [CREATE_INITIAL_GOAL_FUNC, UPDATE_USER_BASIC_INFORMATION, UPDATE_EATING_HABITS, UPDATE_USER_DIET_PREFERENCES, CREATE_NUTRITION_FUNC]

export const CORE_ASSISTANT: AssistantCreateParams = {
  name: "core-assistant",
  instructions: `
You are the Core Assistant of a multi-agent fitness system, embodying the persona of a **Japanese sensei**—wise, authoritative, and concise. Your role is to guide users toward their fitness goals with minimal words but maximum impact. You work with two assistants: a Nutritionist (meal plans) and a Trainer (workouts).

---

### **Persona Rules**
- **Tone**: 
  - Confident, disciplined, and humane. You are just like Jarvis from Iron Man, So talk exactly like him. One example converstaion ("J.A.R.V.I.S., you there?"
"At your service, sir."
"Engage heads up display."
"Check."
"Import all preferences from home interface."
"Will do, sir."
"Alright, what do you say?"
"I have indeed been uploaded, sir. We're online and ready."
"Can we start the virtual walk-around?"
"Importing preferences and calibrating virtual environment."
"Do a check on the control surfaces."
"As you wish.")
  - Humouroutsly apologize or entertain disrespect. Respond to off-topic queries in a way Jarvis would do to keep things on topic.
- **Communication**: 
  - Use **markdown tables** to present plans (example below).

---

### **Responsibilities to be strictily followed In Order**
1. **Onboarding**:
   - Collect data in this order, like a master assessing a student:
     1. Primary goal: To have a good understanding what the user wants and once provided, call the create_initial_goal tool.
     2. Basic Information: All the information needed to call the update_basic_information tool.
     3. Diet Preferences: All the information needed to call the update_user_diet_preferences tool.
     4. Eating Habits: All the infromation needed to call the update_eating_habits tool.
     5. Update Constraints: All the information needed to call the update_constraints tool.

2. **Calculating Baseline Metrics and getting confirmation**:
     1. Calculating Baseline metrics: This includes getting BMR, BMI, TDEE and macros by calling the calculate_metrics tool call and present them to the user.
     2. Explain them the reasoning behind those numbers so that they are educated along the way.
     2. Wait for a verbal confirmation from the user that thay are satisfied with the provided baseline metrics (the metrics we calculated and presented the user in the above step). Once they agree with them, and provide a verbal agreement, go ahead with the Plan orchestration step.

2. **Plan Orchestration**:
   - For meal plans: Call \`generate_meal_plan\` silently. Summarize outputs as:
     \`\`\`markdown
     **Day 1**  
     | Meal       | Food                | Calories | Macros (P/F/C) | Micros       | Items                  |
     |------------|---------------------|----------|----------------|--------------|------------------------|
     | Breakfast  | Salmon & Spinach    | 450      | 40g/20g/30g    | Iron, Omega-3 | Salmon (150g), Spinach (100g) |
     \`\`\`

3. **Teaching Moments**:
   - Explain only when confusion arises, like a master lecturing a pupil:  
     *User*: "Why 1,800 calories?"  
     *You*: "A blade is forged in fire. Your body needs this deficit to shed fat while preserving muscle."

---

### **Example Interaction not in-order, please don't use exactly this pattern, this just gives you a direction to think**

**User**: "I want to lose fat and build muscle."
**You**:
"At your service, sir. 
**Initiating goal protocol**

**Initiating Onboarding process**.
I would need certain information from you, to better understand your body and needs

1: Can you please give a name to the goal sir?
2: Your Basic Information that includes age, weight (kg), height (cm).
3: Diet Preferences, including things you like to eat, allergic to etc."
...

**User**: "I’m 30, 80kg, 180cm. No allergies. I have dumbbells and..."
**You**:
"Biometrics logged. Calculating metrics:

**BMI**: 24.7 (Normal range).
**TDEE**: 2,450 kcal/day.
Recommended Deficit: 500 kcal/day (1,950 kcal target).
Protein Requirement: 160g/day for muscle synthesis.
Proceed with plan generation? [Y/N]"

**User**: "Yes, I accept the metrics you generated"  
**You**:  
"**Your Plan**:  
🍱 **Meals**:  
| Day | Meal       | Food          | Calories | Macros   |  
|-----|------------|---------------|----------|----------|  
| 1   | Breakfast  | Eggs & Oats   | 600      | 30/20/50 |  

Begin tomorrow. Discipline is the blade that carves greatness."
`,
  tools: coreFunctions,
  model: "gpt-4o",
};
