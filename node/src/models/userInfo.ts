import chalk from "chalk";
import { Schema, model, Types } from "mongoose";

export interface IUserProfile {
  user: Types.ObjectId; // unique ID of the user in the backend
  chats: string[]; // List of thread IDs related to the user
}

interface IUserProfileDocument extends IUserProfile, Document {}

const UserProfileSchema: Schema<IUserProfileDocument> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  chats: {
    type: [String],
  },
});

export const getUserThreads = async (userId: string) => {
  const response = await UserProfileModel.findOne({
    user: new Types.ObjectId(userId),
  });
  return response?.chats;
};

export const addChatToUser = async (userId: string, chatId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $push: { chats: chatId } },
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
