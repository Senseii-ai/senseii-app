Core assistant configuration

## Function calls

```json
{
  "name": "create_nutrition_plan",
  "description": "Creates a nutrition plan for the user when core assistant has all the necessary information needed to create the diet plan.\nList of information:\n- basicInformation: The basic information of the user which includes age [required], weight[required], height [required], gender [required].\n- lifestyle: The lifestyle of the user which includes daily routine and exercise routine [required], daily routine [optional].\n- dietPreferences: The diet preferences of the user which includes preferences [required], allergies [required], intolerances, disliked food, favourite food.\n- healthGoals: The health goals of the user which includes weight goal [required], specific nutrition goal [required], medical conditions [required].\n- eatingHabits: The eating habits of the user which includes meals per day [required], meal complexity [optional], cooking time [optional].\n- constraints: The constraints of the user which includes financial [required], geographical [optional].\n\nThe diet plan is created based on the information provided by the user.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "basicInformation": {
        "type": "object",
        "properties": {
          "age": {
            "type": "number",
            "description": "age"
          },
          "weight": {
            "type": "number",
            "description": "weight of the user"
          },
          "height": {
            "type": "number",
            "description": "height of the user"
          },
          "gender": {
            "type": "string",
            "description": "gender of the user"
          }
        }
      },
      "lifeStyle": {
        "type": "object",
        "properties": {
          "dailyRoutine": {
            "type": "string",
            "description": "The daily routine of the user which includes:\n- sedentary\n- light\n- moderate\n- heavy\n- very heavy"
          },
          "exerciseRoutine": {
            "type": "object",
            "properties": {
              "exerciseType": {
                "type": "string",
                "description": "The type of exercise that the user does, which can be of type 'cardio', 'strength', 'flexibility', 'balance', 'none'"
              },
              "frequency": {
                "type": "string",
                "description": "The frequency of the exercise that the user does, which can be of type 'daily', 'weekly', 'monthly'"
              }
            }
          }
        }
      },
      "dietPreferences": {
        "type": "object",
        "properties": {
          "preference": {
            "type": "string",
            "description": "The user's diet preference, which can be of type 'vegetarian', 'non-vegetarian', 'vegan', 'pescatarian', 'omnivore', 'ketogenic', 'paleo'"
          },
          "allergies": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "an array of all the allergies that the user has"
          },
          "intolerances": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "an array of all the intolerances that the user has"
          },
          "dislikedFood": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "an arryay of all the food that the user dislikes"
          },
          "favouriteFood": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "an array of all the food that the user likes"
          }
        }
      },
      "healthGoals": {
        "type": "object",
        "properties": {
          "weightGoal": {
            "type": "string",
            "description": "The user's weight goal, which can be of type 'gain', 'loss', 'maintain'"
          },
          "specificNutritionGoal": {
            "type": "string",
            "description": "The user's specific nutrition goal"
          },
          "medicalConditions": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "an array of all the medical conditions that the user has"
          }
        }
      },
      "eatingHabits": {
        "type": "object",
        "properties": {
          "mealsPerDay": {
            "type": "number",
            "description": "The number of meals that the user has per day"
          },
          "mealComplexity": {
            "type": "string",
            "description": "The complexity of the meals that the user has, which can be of type 'simple', 'moderate', 'complex'"
          },
          "cookingTime": {
            "type": "string",
            "description": "The cooking time of the user, which can be of type 'less than 30 minutes', '30-60 minutes', 'more than 60 minutes'"
          }
        }
      },
      "constraints": {
        "type": "object",
        "properties": {
          "financial": {
            "type": "object",
            "properties": {
              "budget": {
                "type": "number",
                "description": "The user's budget"
              },
              "budgetType": {
                "type": "string",
                "description": "The type of the user's budget, which can be of type 'daily', 'weekly', 'monthly'"
              }
            }
          },
          "geographical": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The user's location so that food specific to that location can be added in the plan"
              }
            }
          }
        }
      }
    },
    "required": []
  }
}
```
