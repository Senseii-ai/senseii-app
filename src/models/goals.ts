import { Schema, model, Document } from "mongoose";
import {
  CreateUserGoalDTO,
  IBasicInformation,
  IConstraints,
  IDietPreferences,
  IEatingHabits,
  IHealthGoals,
  ILifeStyle,
  NutritionPlan,
  Result,
  UserGoals,
} from "@senseii/types";
import { getUserId } from "@middlewares/auth";
import { CreateInitialGoalDTO } from "@services/openai/assistants/core";
import { infoLogger } from "@utils/logger";
import { handleDBError } from "./utils/error";

const layer = "DB";
const name = "GOAL STORE";

export const goalStore = {
  getUserGoal: async (userId: string): Promise<Result<UserGoals>> => {
    try {
      const response = await UserGoalModel.findOne({ userId: userId })
      if (!response) {
        throw new Error("User not found")
      }

      console.log("response", response)
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: handleDBError(error, name)
      }
    }
  }
}

interface UserGoalDocument extends UserGoals, Document { }
interface UserBasicInformationDocument extends IBasicInformation, Document { }
interface UserLifeStyleDocument extends ILifeStyle, Document { }
interface UserDietPreferencesDocument extends IDietPreferences, Document { }

const UserBasicInformation: Schema<UserBasicInformationDocument> = new Schema({
  height: {
    value: {
      type: Number,
    },
    unit: {
      type: String,
    },
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  weight: {
    value: {
      type: Number,
    },
    unit: {
      type: String,
    },
  },
});

const UserLifeStyleSchema: Schema<UserLifeStyleDocument> = new Schema({
  dailyRoutine: {
    type: String,
    enum: ["sedenatry", "light", "moderate", "heavy", "very heavy"],
  },
  exerciseRoutine: [
    {
      exerciseType: {
        type: String,
        enum: ["cardio", "strength", "flexibility", "balance", "none"],
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
    },
  ],
});

const DietPreferencesSchema: Schema<UserDietPreferencesDocument> = new Schema({
  preference: {
    type: String,
    enum: [
      "vegetarian",
      "non-vegetarian",
      "vegan",
      "pescatarian",
      "omnivore",
      "ketogenic",
      "paleo",
    ],
  },
  allergies: [String],
  intolerances: [String],
  dislikedFood: [String],
  favouriteFood: [String],
});

const EatingHabitsSchema: Schema<Document & IEatingHabits> = new Schema({
  mealsPerDay: {
    type: Number,
  },
  mealComplexity: {
    type: String,
    enum: ["simple", "moderate", "complex"],
  },
  cookingTime: {
    type: String,
    enum: ["less than 30 minutes", "30-60 minutes", "more than 60 minutes"],
  },
});

const ConstraintsSchema: Schema<Document & IConstraints> = new Schema({
  financial: {
    budget: {
      type: Number,
    },
    budgetType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
  },
  geographical: {
    location: {
      type: String,
    },
  },
});

const HealthGoalsSchema: Schema<Document & IHealthGoals> = new Schema({
  weightGoal: {
    type: String,
    enum: ["gain", "loss", "maintain"],
  },
  specificNutritionGoal: {
    type: String,
  },
  medicalConditions: {
    type: String,
  },
});

const UserGoalSchema: Schema<UserGoalDocument> = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "UserProfile",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
    ref: "Chats",
  },
  workoutPlan: {
    type: String,
    // FIX: Connect when workout plans model is done.
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  nutritionPlan: {
    type: String,
    ref: "NutritionPlans",
  },
  basicInformation: UserBasicInformation,
  constraints: ConstraintsSchema,
  eatingHabits: EatingHabitsSchema,
  dietPreferences: DietPreferencesSchema,
  lifeStyle: UserLifeStyleSchema,
  healthGoal: HealthGoalsSchema
});

export const UserGoalModel = model<UserGoalDocument>("Goals", UserGoalSchema);

export const saveUpdatedBasicInformaion = async (
  data: IBasicInformation,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Basic Information",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { basicInformation: data } }
  );

  return response;
};

export const saveUpdatedDietPreferences = async (
  data: IDietPreferences,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Diet Preferences",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { dietPreferences: data } }
  );

  return response;
};

export const saveUpdatedEatingHabits = async (
  data: IEatingHabits,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Eating Habits",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { eatingHabits: data } }
  );

  return response;
};

export const saveNutritionPlan = async (
  data: NutritionPlan,
  userId: string
) => {
  infoLogger({
    message: "saving updated Nutrition Plan",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { nutritionPlan: data } }
  );

  return response;
};

export const saveUpdatedUserConstraints = async (
  data: IConstraints,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Constraints",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { constraints: data } }
  );

  return response;
};

export const saveInitialGoal = async (data: CreateInitialGoalDTO) => {
  const startDate = new Date(); // Current date
  let endDate;
  if (data.endDate <= 0) {
    endDate = "N/A";
  } else {
    endDate = new Date(
      startDate.getTime() + 4 * 7 * 24 * 60 * 60 * 1000
    ).toISOString();
  }

  // there is just one user goal in the system.
  const goal = await UserGoalModel.findOne({ userId: getUserId() });
  if (!goal) {
    throw new Error("unable to find user");
  }

  const updatedUserGoalData: CreateUserGoalDTO = {
    userId: goal.userId,
    title: data.title,
    description: data.description,
    startDate: startDate.toISOString(),
    endDate: endDate,
    chatId: goal.chatId,
  };

  const response = await UserGoalModel.findOneAndReplace(
    { userId: goal.userId },
    updatedUserGoalData
  );
  return response;
};

export const saveUpdateUserHealthGoals = async (
  data: IHealthGoals,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Health Goals",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { healthGoal: data } }
  );

  return response;
};

export const saveUpdatedLifeStyle = async (
  data: ILifeStyle,
  userId: string
) => {
  infoLogger({
    message: "saving updated user Life Style",
    status: "INFO",
    layer,
    name,
  });

  const response = await UserGoalModel.updateOne(
    { userId: userId },
    { $set: { lifeStyle: data } }
  );

  return response;
};
