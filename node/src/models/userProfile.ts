import chalk from "chalk";
import { Schema, model, Types } from "mongoose";
import { infoLogger } from "../utils/logger/logger";
import { Result, RunRequestDTO, User, UserProfile, UserProfileModel, userChatsSchema, userProfileModelSchema } from "@senseii/types";
import { z } from "zod";
import { handleDBError } from "./utils/error";

type Chat = z.infer<typeof userChatsSchema>
export type UserProfileModelSchema = z.infer<typeof userProfileModelSchema>
interface IUserProfileDocument extends UserProfileModel, Document { }
interface IChatsDocument extends Chat, Document { }

const IChatSchema: Schema<IChatsDocument> = new Schema({
  id: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
});


// FIX: This is not the complete user information.
const UserProfileSchema: Schema<IUserProfileDocument> = new Schema({
  id: {
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
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true
  },
  chats: {
    type: [IChatSchema],
  },
});

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema,
);

export const userProfileStore = {
  GetThreadByChatId: (data: RunRequestDTO): Promise<Result<Chat>> => getUserThreadId(data),
  AddChatToUser: (chatId: string, userId: string, threadId: string, summary: string): Promise<Result<null>> => addChatToUser(chatId, userId, threadId, summary),
  CreateProfile: (user: User) => createUserProfile(user)
}

const createUserProfile = async (user: User): Promise<Result<null>> => {
  try {
    const newProfile = await new UserProfileModel({
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      verified: user.verified,
      chats: []
    }).save()
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "USER PROFILE DATASTORE")
    }
  }

}

export const addChatToUser = async (
  chatId: string,
  userId: string,
  threadId: string,
  summary: string,
): Promise<Result<null>> => {
  try {
    infoLogger({ message: "saving new chat in user profile", status: "INFO", layer: 'DB', name: "USER PROFILE STORE" })
    const newChat: Chat = {
      id: chatId,
      threadId: threadId,
      summary: summary,
    };

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }


    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { id: userId },
      { $push: { chats: newChat } },
      { new: true, useFindAndModify: false },
    )

    if (!updatedUserProfile) {
      throw new Error("error updating profile")
    }

    infoLogger({ message: "Profile was updated", status: "success", layer: "DB", name: "USER PROFILE STORE" });
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "USER PROFILE STORE")
    }
  }
};

export const saveNewUserProfile = async (user: UserProfileModelSchema) => {
  try {
    const newProfile = await (new UserProfileModel(user)).save()
    infoLogger({ status: "success", message: "profile saved in db" })
    return newProfile
  } catch (error) {
    infoLogger({ status: "failed", message: error as string })
    throw error
  }

}

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
export const getUserThreadId = async ({ chatId, userId }: RunRequestDTO): Promise<Result<Chat>> => {
  try {
    const response = await UserProfileModel.findOne({
      "chats.id": chatId,
    });
    if (!response) {
      throw new Error("Chat not Found")
    }
    const requiredThread = response.chats.find((item: Chat) => item.id === chatId);
    if (!requiredThread) {
      throw new Error("Thread not Found")
    }
    return {
      success: true,
      data: requiredThread,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "User Profile Store")
    }
  }

};

export const getThreadByChatId = async (chatId: string) => {
  const response = await UserProfileModel.findOne({
    "chats.id": chatId,
  });
  const requiredChatId = response?.chats.find((item) => item.id === chatId);
  return requiredChatId;
};

export const getThreadById = async (userId: string, threadId: string) => {
  const response = await UserProfileModel.findOne({
    user: new Types.ObjectId(userId),
  });
  const requiredChat = response?.chats.find((item) => item.id === threadId);
  return requiredChat;
};

export const getUserThreads = async (userId: string) => {
  const response = await UserProfileModel.findOne({
    user: new Types.ObjectId(userId),
  });

  if (!response) {
    throw new Error("Error finding User Profile");
  }

  return response?.chats;
};

export default UserProfileModel;
