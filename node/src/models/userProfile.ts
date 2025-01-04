import { Schema, model, Types } from "mongoose";
import { infoLogger } from "../utils/logger/logger";
import {
  IChat,
  Result,
  RunRequestDTO,
  User,
  UserProfile,
} from "@senseii/types";
import { handleDBError } from "./utils/error";

const layer = "DB";
const name = "USER PROFILE STORE";

export const userProfileStore = {
  GetThreadByChatId: (data: RunRequestDTO): Promise<Result<IChat>> =>
    getUserThreadId(data),
  AddChatToUser: (
    chatId: string,
    userId: string,
    threadId: string,
    summary: string
  ): Promise<Result<null>> => addChatToUser(chatId, userId, threadId, summary),
  CreateProfile: (user: User) => createUserProfile(user),
  GetAllChats: (email: string): Promise<Result<IChat[]>> => getAllChats(email),
};

const getAllChats = async (email: string): Promise<Result<IChat[]>> => {
  try {
    infoLogger({ message: `user: ${email}`, status: "INFO", layer, name })
    const userProfile = await UserProfileModel.findOne({ email: email })
      .select("chats")
      .exec();
    if (!userProfile) {
      throw new Error("chats not found");
    }

    const chats = userProfile.chats
    infoLogger({ message: `chats found for user: ${email}`, status: "INFO", layer, name })
    return {
      success: true,
      data: chats,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name),
    };
  }
};

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
      chats: [],
    }).save();
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

export const addChatToUser = async (
  chatId: string,
  userId: string,
  threadId: string,
  summary: string
): Promise<Result<null>> => {
  try {
    infoLogger({
      message: "saving new chat in user profile",
      status: "INFO",
      layer: "DB",
      name: "USER PROFILE STORE",
    });
    const newChat: IChat = {
      id: chatId,
      threadId: threadId,
      title: summary,
      userId: userId,
      createdAt: new Date().toISOString(),
      path: "not supported yet",
      sharePath: "not supported yet"
    };

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { id: userId },
      { $push: { chats: newChat } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedUserProfile) {
      throw new Error("error updating profile");
    }

    infoLogger({
      message: "Profile was updated",
      status: "success",
      layer: "DB",
      name: "USER PROFILE STORE",
    });
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "USER PROFILE STORE"),
    };
  }
};

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
export const getUserThreadId = async ({
  chatId,
  userId,
}: RunRequestDTO): Promise<Result<IChat>> => {
  try {
    const response = await UserProfileModel.findOne({
      "chats.id": chatId,
    });
    if (!response) {
      throw new Error("Chat not Found");
    }
    const requiredThread = response.chats.find(
      (item: IChat) => item.id === chatId
    );
    if (!requiredThread) {
      throw new Error("Thread not Found");
    }
    return {
      success: true,
      data: requiredThread,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "User Profile Store"),
    };
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

const IChatSchema: Schema<IChat> = new Schema({
  id: {
    type: String,
    required: true
  },
  threadId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  path: {
    // NOTE: We don't support sharing chats as of now.
    type: String,
  },
  // NOTE: messages is missing.
  sharePath: {
    type: String
  }
})

interface IUserProfileDocument extends UserProfile, Document { }

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
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true
  },
  chats: {
    type: [IChatSchema],
  },
});

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema
);

export default UserProfileModel;
