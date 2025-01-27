import { Schema, Types, model } from "mongoose";
import { infoLogger } from "../utils/logger/logger";
import { CreateUserGoalDTO, IChat, NutritionPlan, Result, User, UserGoal, UserGoals, UserProfile, userGoalDTO } from "@senseii/types";
import { handleDBError } from "./utils/error";
import { UserGoalModel } from "./goals";
import { ChatModel, ServerMessage } from "./chats";
import { title } from "process";
import NutritionPlanModel from "./nutritionPlan";

const layer = "DB";
const name = "USER PROFILE STORE";

export const userProfileStore = {
  SaveChat: (args: ServerMessage[], chatId: string): Promise<Result<null>> => saveChat(args, chatId),
  GetUserGoals: (userId: string) => getUserGoals(userId),
  CreateProfile: (user: User): Promise<Result<null>> => createUserProfile(user),
  AddNewGoal: (args: CreateUserGoalDTO, threadId: string): Promise<Result<string>> => addNewGoal(args, threadId),
  GetChat: (userId: string, chatId: string): Promise<Result<IChat>> => getChat(userId, chatId)
};

const saveChat = async (args: ServerMessage[], chatId: string): Promise<Result<null>> => {
  try {
    const response = await ChatModel.findOneAndUpdate({ _id: chatId }, { $push: { messages: args } }, { new: true })
    if (!response) {
      throw new Error("unable to add chat to the user")
    }
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name)
    }
  }
}


// FIX: move this to types
export interface UserGoalItem {
  goalId: string,
  userId: string,
  title: string,
  chatId: string,
  description: string,
  startDate: string,
  endDate: string,
  nutritionPlan: NutritionPlan | null | string
}

const getUserGoals = async (userId: string): Promise<Result<UserGoalItem[]>> => {
  try {
    // NOTE: We can keep chaining populate here.
    let goals = await UserProfileModel.findOne({ userId: userId }).populate("goalIds")
    UserProfileModel
    if (!goals) {
      return {
        success: true,
        data: []
      }
    }


    const userGoalList: UserGoalItem[] = goals.goalIds.map((item: any) => {
      return {
        goalId: item._id,
        userId: item.userId,
        title: item.title,
        chatId: item.chatId,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        nutritionPlan: item.nutritionPlan
      }
    })

    // get the nutritionPlan Id.
    const nutritionPlanId = userGoalList[0].nutritionPlan
    // get the nutritionPlan.
    if (!nutritionPlanId) {
      userGoalList[0].nutritionPlan = null
    } else {
      const plan = await NutritionPlanModel.findOne({ _id: nutritionPlanId })
      if (!plan) {
        userGoalList[0].nutritionPlan = null
      } else {
        const nutritionPlan: NutritionPlan = {
          userId: userId,
          dailyPlan: plan.dailyPlan,
          type: plan.type
        }
        userGoalList[0].nutritionPlan = nutritionPlan
      }
    }

    return {
      success: true,
      data: userGoalList
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name)
    }
  }
}

const addNewGoal = async (args: CreateUserGoalDTO, threadId: string): Promise<Result<string>> => {
  try {
    infoLogger({ message: "saving new user goal", status: "INFO", layer, name })
    const newChat = await new ChatModel({ userId: args.userId, messages: [], threadId: threadId }).save()
    const newGoal = await new UserGoalModel({ ...args, chatId: newChat.id }).save()
    const newGoalId = newGoal.id as string
    const updatedUserProfile = await UserProfileModel.findOneAndUpdate({ userId: args.userId }, { $push: { goalIds: newGoalId } }, { new: true, upsert: true })
    if (!updatedUserProfile) {
      throw new Error("unable to create new goal")
    }
    return {
      success: true,
      data: newChat.id
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name)
    }
  }
}

const getChat = async (
  userId: string,
  chatId: string
): Promise<Result<IChat>> => {
  try {
    infoLogger({ message: `trying to get chat ${chatId}`, status: "INFO", layer, name })
    const chat = await ChatModel.findOne({
      userId: userId, _id: new Types.ObjectId(chatId)
    })
    if (!chat) {
      throw new Error(`chat ${chatId} not found`);
    }

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name),
    };
  }
};

// const getAllChats = async (email: string): Promise<Result<IChat[]>> => {
//   try {
//     infoLogger({ message: `user: ${email}`, status: "INFO", layer, name });
//     const userProfile = await ChatModel.findOne({ email: email })
//       .select("chats")
//       .exec();
//     if (!userProfile) {
//       throw new Error("chats not found");
//     }
//
//     const chats = userProfile.chats;
//     infoLogger({
//       message: `chats found for user: ${email}`,
//       status: "INFO",
//       layer,
//       name,
//     });
//     return {
//       success: true,
//       data: chats,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: handleDBError(error, name),
//     };
//   }
// };

const createUserProfile = async (user: User): Promise<Result<null>> => {
  try {
    infoLogger({ message: "Creating new User profile", status: "INFO", layer, name })
    // FIX: This is not complete.
    const newProfile = await new UserProfileModel({
      userId: user.userId,
      email: user.email,
      name: user.name,
      // firstName: user.firstName,
      // lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      verified: user.verified,
      chats: [],
    }).save();

    infoLogger({ message: "new user profile created", status: "success", layer, name })
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "USER PROFILE DATASTORE"),
    };
  }
};

// export const addChatToUser = async (
//   chat: IChat,
//   userId: string
// ): Promise<Result<string>> => {
//   try {
//     infoLogger({
//       message: "saving new chat in user profile",
//       status: "INFO",
//       layer: "DB",
//       name: "USER PROFILE STORE",
//     });
//
//     if (!chat.messages || chat.messages.length === 0 || !chat.messages[0]) {
//       throw new Error("Invalid Chat Object");
//     }
//
//     await UserProfileModel.updateOne(
//       { id: userId, "chats.id": chat.id }, // Find the user and the specific chat
//       {
//         $push: { "chats.$.messages": chat.messages[0] }, // Push the new message to the messages array
//       },
//       { upsert: false } // Do not create a new chat if it doesn't exist here
//     ).exec()
//
//     const userProfile = await UserProfileModel.findOne({
//       id: userId,
//       "chats.id": chat.id,
//     });
//
//     if (!userProfile) {
//       await UserProfileModel.updateOne(
//         { id: userId },
//         { $push: { chats: chat } }, // Add the new chat to the chats array
//         { upsert: true } // Ensure the user exists
//       ).exec();
//     }
//
//     infoLogger({
//       message: "Profile was updated",
//       status: "success",
//       layer: "DB",
//       name: "USER PROFILE STORE",
//     });
//     return {
//       success: true,
//       data: chat.id,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: handleDBError(error, "USER PROFILE STORE"),
//     };
//   }
// };

export const saveNewUserProfile = async (user: UserProfile) => {
  try {
    const newProfile = await new UserProfileModel(user).save();
    infoLogger({ status: "success", message: "profile saved in db" });
    return newProfile;
  } catch (error) {
    infoLogger({ status: "failed", message: error as string });
    throw error;
  }
};

export const getUserByUserId = async (userId: string) => {
  infoLogger({ message: "get user by userid" });
  const response = await UserProfileModel.findOne({
    user: userId,
  });
  if (!response) {
    return null;
  }
  return response;
};

// FIX: Is this Database call costly?
// export const getUserThreadId = async ({
//   chatId,
//   userId,
// }: {
//   chatId: string;
//   userId: string;
// }): Promise<Result<IChat>> => {
//   try {
//     const response = await UserProfileModel.findOne({ id: userId })
//     if (!response) {
//       throw new Error(`user:${userId} not found`)
//     }
//
//     response.chats.map(item => console.log("CHAT", item))
//     // const response = await UserProfileModel.findOne({
//     //   "chats.id": chatId,
//     // });
//     if (!response) {
//       throw new Error("Chat not Found");
//     }
//     const requiredThread = response.chats.find(
//       (item: IChat) => item.id === chatId
//     );
//     if (!requiredThread) {
//       throw new Error("Thread not Found");
//     }
//     return {
//       success: true,
//       data: requiredThread,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: handleDBError(error, "User Profile Store"),
//     };
//   }
// };
//
// export const getThreadByChatId = async (chatId: string) => {
//   const response = await UserProfileModel.findOne({
//     "chats.id": chatId,
//   });
//   const requiredChatId = response?.chats.find((item) => item.id === chatId);
//   return requiredChatId;
// };
//
// export const getThreadById = async (userId: string, threadId: string) => {
//   const response = await UserProfileModel.findOne({
//     user: new Types.ObjectId(userId),
//   });
//   const requiredChat = response?.chats.find((item) => item.id === threadId);
//   return requiredChat;
// };
//
// export const getUserThreads = async (userId: string) => {
//   const response = await UserProfileModel.findOne({
//     user: new Types.ObjectId(userId),
//   });
//
//   if (!response) {
//     throw new Error("Error finding User Profile");
//   }
//
//   return response?.chats;
// };

interface IUserProfileDocument extends UserProfile, Document { }

const UserProfileSchema: Schema<IUserProfileDocument> = new Schema({
  userId: {
    type: String,
    ref: "Users",
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email must be provided"],
  },
  name: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  createdAt: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
  goalIds: [{
    type: String,
    ref: "Goals"
  }],
});

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema
);

export default UserProfileModel;
