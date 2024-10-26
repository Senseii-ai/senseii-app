import chalk from "chalk";
import { Schema, model, Types } from "mongoose";
import { infoLogger } from "../utils/logger/logger";

export interface IUserProfile {
  user: Types.ObjectId; // unique ID of the user in the backend
  chats: IChat[]; // List of chat IDs related to the user. Chat ID is a nano Id for the frontend
}

export interface IChat {
  id: string;
  threadId: string;
  summary: string;
}

interface IUserProfileDocument extends IUserProfile, Document {}
interface IChatsDocument extends IChat, Document {}

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

const UserProfileSchema: Schema<IUserProfileDocument> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  chats: {
    type: [IChatSchema],
  },
});

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema,
);

export const getThreadAndUserByChatId = async (chatId: string) => {
  const response = await UserProfileModel.findOne({
    "chats.id": chatId,
  });
  const requiredThreadId = response?.chats.find((item) => item.id === chatId);
  return {
    user: String(response?.user),
    existingThreadId: requiredThreadId,
  };
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

export const addChatToUser = async (
  chatId: string,
  userId: string,
  threadId: string,
  summary: string,
) => {
  try {
    const newChat: IChat = {
      id: chatId,
      threadId: threadId,
      summary: summary,
    };

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $push: { chats: newChat } },
      { new: true, useFindAndModify: false },
    ).exec();
    infoLogger({ message: "Profile was updated" });

    return updatedUserProfile;
  } catch (error) {
    console.error(
      chalk.white(chalk.bgRed("[ERROR]"), "Error updating user profile", error),
    );
    throw error;
  }
};

export default UserProfileModel;
