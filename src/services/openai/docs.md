# Internal Documentation for Assistants

## Functions

### Core Assistant

#### On-boarding and Data collection

- `create_initial_goal`: Saves user's primary goal along with handling timeline
- `update_user_goals`: Saves user profile related data, Basic information, life-Style,
  diet preferences, eating Habits, constraints.

  > [!TIP]
  > Think of whether user goal update needs to updating the entire preferneces section
  > in one go, or multiple steps targeting Basic Information, life-style etc. separately.

- `calculate_metrics`: Calculates user metrics like **BMI**, **BMR**, **TDEE**, and
  **Macro/Micro** nutrient targets. This information needs to be stored for the
  **Nutrition/Workout** assistants to use.
- `generate_meal_plan`: Generate a meal Plan depending on user preferences, metrics
  etc.

#### Plan generation, Adjustment and Validation

- `generate_workout_plan`: Generate a workout Plan depending on user preferences,
  metrics etc.
- `modify_meal_plan`: Modify the previously generated meal plan depending on user
  feedback.
- `modify_workout_plan`: Modify the previously generated workout plan depending upon
  user feedback.
- `meal_plan_confirmation`: Take UI triggered confirmation from the user when they
  accept the generated meal plan.
- `workout_plan_confirmation`: Take UI triggered confirmation from the user when
  they accept the generated workout plan.
  > [!TIP]
  > Make sure the plans are shown sequentially, through UI modals, so it is easier
  > for the user to check them out and provide feedback.

#### Progress Tracking

- Future Scope

> [!IMPORTANT]
> Figure out a way to asynchronously handle Database Write calls for steps like
> saving generated plans, fetching user history
