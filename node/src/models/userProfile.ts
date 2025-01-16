import { Schema, model, Types } from "mongoose";
import { infoLogger } from "../utils/logger/logger";
import { IChat, Result, User, UserProfile, createError } from "@senseii/types";
import { handleDBError } from "./utils/error";

const layer = "DB";
const name = "USER PROFILE STORE";

export const userProfileStore = {
  AddChatToUser: (chat: IChat, userId: string): Promise<Result<string>> =>
    addChatToUser(chat, userId),

  // FIX: Add temporary image URL.
  CreateProfile: (user: User) => createUserProfile(user),
  GetAllChats: (email: string): Promise<Result<IChat[]>> => getAllChats(email),
  GetChat: (userId: string, chatId: string): Promise<Result<IChat>> => getChat(userId, chatId),
};

const getChat = async (
  userId: string,
  chatId: string
): Promise<Result<IChat>> => {
  try {
    infoLogger({ message: `trying to get chat ${chatId}`, status: "INFO", layer, name })
    const user = await UserProfileModel.findOne({
      id: userId,
    })
    if (!user) {
      throw new Error(`user with chat ${userId} not found`);
    }

    infoLogger({ message: "CHATS PRESENT IN THE DATABASE:::", status: "alert", layer, name })
    user.chats.map(item => console.log(item.id))

    const requiredChat = user.chats.find(item => item.id === chatId)
    if (!requiredChat) {
      throw new Error(`chat ${chatId} does not exist`);
    }
    return {
      success: true,
      data: requiredChat,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, name),
    };
  }
};

const getAllChats = async (email: string): Promise<Result<IChat[]>> => {
  try {
    infoLogger({ message: `user: ${email}`, status: "INFO", layer, name });
    const userProfile = await UserProfileModel.findOne({ email: email })
      .select("chats")
      .exec();
    if (!userProfile) {
      throw new Error("chats not found");
    }

    const chats = userProfile.chats;
    infoLogger({
      message: `chats found for user: ${email}`,
      status: "INFO",
      layer,
      name,
    });
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
    infoLogger({ message: "Creating new User profile", status: "INFO", layer, name })
    const newProfile = await new UserProfileModel({
      id: user.id,
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

export const addChatToUser = async (
  chat: IChat,
  userId: string
): Promise<Result<string>> => {
  try {
    infoLogger({
      message: "saving new chat in user profile",
      status: "INFO",
      layer: "DB",
      name: "USER PROFILE STORE",
    });

    if (!chat.messages || chat.messages.length === 0 || !chat.messages[0]) {
      throw new Error("Invalid Chat Object");
    }

    await UserProfileModel.updateOne(
      { id: userId, "chats.id": chat.id }, // Find the user and the specific chat
      {
        $push: { "chats.$.messages": chat.messages[0] }, // Push the new message to the messages array
      },
      { upsert: false } // Do not create a new chat if it doesn't exist here
    ).exec()

    const userProfile = await UserProfileModel.findOne({
      id: userId,
      "chats.id": chat.id,
    });

    if (!userProfile) {
      await UserProfileModel.updateOne(
        { id: userId },
        { $push: { chats: chat } }, // Add the new chat to the chats array
        { upsert: true } // Ensure the user exists
      ).exec();
    }

    infoLogger({
      message: "Profile was updated",
      status: "success",
      layer: "DB",
      name: "USER PROFILE STORE",
    });
    return {
      success: true,
      data: chat.id,
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
}: {
  chatId: string;
  userId: string;
}): Promise<Result<IChat>> => {
  try {
    const response = await UserProfileModel.findOne({ id: userId })
    if (!response) {
      throw new Error(`user:${userId} not found`)
    }

    response.chats.map(item => console.log("CHAT", item))
    // const response = await UserProfileModel.findOne({
    //   "chats.id": chatId,
    // });
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

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant"], // Matches z.enum(["user", "assistant"])
    required: true,
  },
  content: {
    type: String, // Matches z.string()
    required: true,
  },
});

const IChatSchema: Schema<IChat> = new Schema({
  id: {
    type: String,
    required: true,
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
  messages: {
    type: [MessageSchema],
    required: true,
  },
  path: {
    // NOTE: We don't support sharing chats as of now.
    type: String,
  },
  // NOTE: messages is missing.
  sharePath: {
    type: String,
  },
});

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
  chats: {
    type: [IChatSchema],
  },
});

const UserProfileModel = model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema
);

export default UserProfileModel;
