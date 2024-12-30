import mongoose, { Schema } from "mongoose";
import { infoLogger } from "@utils/logger";
import { CreateUserRequest, User, UserLoginReponseDTO, UserModelSchema } from "@senseii/types";
import { getSalt, hashPassword } from "@utils/crypt";
import { Result } from "types";
import { handleDBError } from "./utils/error";

export const userStore = {
  getUserByEmail: (email: string) => getUserByEmail(email),
  saveNewUser: (user: CreateUserRequest) => saveNewUser(user),
  getUserWithPassword: (email: string) => getUserWithPassword(email)
}

const UserSchema: Schema = new Schema<UserModelSchema>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email must be provided"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    lastLoginAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        return {
          email: ret.email,
          firstName: ret.firstName,
          lastName: ret.lastName,
          lastLoginAt: ret.lastLoginAt,
          createdAt: ret.createdAt,
        };
      },
    },
  }
);

const getUserWithPassword = async (email: string): Promise<Result<UserModelSchema>> => {
  try {
    const response = await UserModel.findOne({ email: email });
    if (!response) {
      throw new Error("user does not exist")
    }
    return {
      success: true,
      data: response
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "User Store")
    }
  }
}

export const getUserByEmail = async (email: string): Promise<Result<User>> => {
  try {
    const response = await UserModel.findOne({ email: email });
    if (!response) {
      throw new Error("user does not exist")
    }
    return {
      success: true,
      data: response
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "User Store")
    }
  }
};

export const saveNewUser = async (
  user: CreateUserRequest
): Promise<Result<User>> => {
  try {
    const salt = getSalt();
    const hashedPassword: string = await hashPassword(user.password, salt);
    const newUser = await new UserModel({
      ...user,
      lastLoginAt: new Date(),
      passwordSalt: salt,
      password: hashedPassword,
    }).save();
    infoLogger({ layer: "DB", status: "INFO", message: `saved ${user} in db` });
    return {
      success: true,
      data: newUser.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "User Store"),
    };
  }
};

export const UserModel = mongoose.model<UserModelSchema>("Users", UserSchema);
