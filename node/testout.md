# Things you should test out for the future

## Seperating every layer

check if you can seperate the storage, service etc. other layers in their own section.

## Using absolute imports

you can use @importName for imports instead of using long import statements

## Services:

### Open AI

- API:
  - controllers (takes Services as argument and creates controller)
  - routes (gets the services, repositories and controllers and creates a router using them):
    - getThreads
    - createThread (optional)
    - chat
    - getGoals
    - createGoals
    - updateGoalById
    - deleteGoal
    - getThreadMessages
    - getAllWorkoutPlans
    - getAllNutritionPlan
- domain:
  - entities (contains interfaces and schemas):
    - userThreads
    - plans.workout.ts
    - plans.nutrition.ts
    - goals
    - preferences
  - interfaces (contains all the possible actions on each entity:
    - user.threadrepository.ts:
      - addNewThread
      - getThreads
      - getThreadById
      - getThreadMessages
    - plans.workout.respository.ts
      - createWorkoutPlan
      - updateWorkoutPlan
      - getAllWorkoutPlans
    - plans.nutrition.respository.ts
      - createNutritionPlan
      - updateNutritionPlan
      - getAllNutritionPlan
    - goals.respository.ts
      - addNewGoal
      - getGoals
      - getGoalById
    - preferences.respository.ts
      - createUserPreference
      - getUserPreferences
      - updateUserPreference
  - services (services recieve respective repositories to handle database functions):
    - ThreadService
    - workoutService
    - nutritionService
    - workoutService
    - goalService
    - preferenceService
- infrastructure:
  - repositories
    - mongo (these implement the interfaces defined above):
      - userThreads
      - Plans
      - Goals
      - Preferences
      -
