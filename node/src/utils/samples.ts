const sampleUserGoal = {
  goalName: "Weight Loss and Healthy Living",
  description: "Achieve sustainable weight loss while maintaining a balanced nutrition plan",
  preferences: {
    type: "userPreferences",
    basicInformation: {
      age: 30,
      weight: {
        value: 85,
        unit: "Kilograms"
      },
      height: {
        value: 175,
        unit: "Centimeters"
      },
      gender: "male"
    },
    lifeStyle: {
      dailyRoutine: "moderate",
      exerciseRoutine: [
        {
          exerciseType: "cardio",
          frequency: "daily"
        },
        {
          exerciseType: "strength",
          frequency: "weekly"
        }
      ]
    },
    dietPreferences: {
      preference: "omnivore",
      allergies: ["peanuts", "shellfish"],
      intolerances: ["lactose"],
      dislikedFood: ["mushrooms", "olives"],
      favouriteFood: ["chicken", "sweet potatoes", "quinoa"]
    },
    healthGoals: {
      weightGoal: "loss",
      specificNutritionGoal: "Reduce processed food intake and increase protein consumption",
      medicalConditions: ["mild hypertension"]
    },
    eatingHabits: {
      mealsPerDay: 4,
      mealComplexity: "moderate",
      cookingTime: "30-60 minutes"
    },
    constraints: {
      financial: {
        budget: 300,
        budgetType: "weekly"
      },
      geographical: {
        location: "New York, USA"
      }
    }
  },
  nutritionPlan: {
    type: "nutritionPlan",
    nutritionPlan: {
      plan: [
        {
          day: "Monday",
          meals: [
            {
              type: "Breakfast",
              food: "Oatmeal with fruits and nuts",
              macros: {
                protein: 15,
                dietryFat: 12,
                carbohydrates: 45,
                water: 250
              },
              micros: {
                vitamins: 80,
                dietryMinerals: 70
              },
              calories: 350,
              items: [
                {
                  item: "oats",
                  proportion: 50,
                  unit: "grams"
                },
                {
                  item: "almonds",
                  proportion: 15,
                  unit: "grams"
                },
                {
                  item: "banana",
                  proportion: 1,
                  unit: "count"
                }
              ]
            }
            // Additional meals can be added here
          ]
        }
        // Additional days can be added here
      ]
    }
  },
  workoutPlan: "Custom workout plan focusing on cardio and strength training",
  startDate: new Date("2024-11-20"),
  endDate: new Date("2025-02-20"),
  threads: {
    coreThreadId: "thread_core_123",
    nutritionThreadId: "thread_nutrition_456",
    workoutThreadId: "thread_workout_789"
  }
};


