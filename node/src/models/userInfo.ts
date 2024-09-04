import chalk from "chalk";
import { Schema, model, Types } from "mongoose";

export interface IUserProfile {
  user: Types.ObjectId; // unique ID of the user in the backend
  chats: IChat[]; // List of thread IDs related to the user
}

export interface IChat {
  id: string;
  summary: string;
}

interface IUserProfileDocument extends IUserProfile, Document {}
interface IChatsDocument extends IChat, Document {}

const IChatSchema: Schema<IChatsDocument> = new Schema({
  id: {
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

export const getUserThreads = async (userId: string) => {
  const response = await UserProfileModel.findOne({
    user: new Types.ObjectId(userId),
  });
  return response?.chats;
};

export const addChatToUser = async (
  userId: string,
  threadId: string,
  summary: string,
) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const newChat: IChat = {
      id: threadId,
      summary: summary,
    };

    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $push: { chats: newChat } },
      { new: true, useFindAndModify: false },
    ).exec();

    return updatedUserProfile;
  } catch (error) {
    console.error(
      chalk.white(chalk.bgRed("[ERROR]"), "Error updating user profile", error),
    );
    throw error;
  }
};

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema,
);

export default UserProfileModel;
