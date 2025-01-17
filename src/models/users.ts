import mongoose, { Schema } from "mongoose";
import { infoLogger } from "@utils/logger";
import { CreateUserRequest, Result, User, UserModelSchema } from "@senseii/types";
import { getSalt, hashPassword } from "@utils/crypt";
import { handleDBError } from "./utils/error";
import { userProfileStore } from "./userProfile";

export const userStore = {
  getUserByEmail: (email: string): Promise<Result<User>> => getUserByEmail(email),
  saveNewUser: (user: CreateUserRequest, isOAuth: boolean, name?: string): Promise<Result<User>> => saveNewUser(user, isOAuth, name),
  getUserWithPassword: (email: string): Promise<Result<UserModelSchema>> => getUserWithPassword(email),
}

const UserSchema: Schema<UserModelSchema> = new Schema<UserModelSchema>(
  {
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
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true
    }
  },
  {
    toJSON: {
      // FIX: This a single point of failure for queries.
      transform: (doc, ret) => {
        return {
          id: doc.id,
          name: doc.name,
          email: ret.email,
          firstName: ret.firstName,
          lastName: ret.lastName,
          lastLoginAt: ret.lastLoginAt,
          createdAt: ret.createdAt,
          verified: doc.verified
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
  user: CreateUserRequest,
  isOAuth: boolean,
  name?: string
): Promise<Result<User>> => {
  try {
    infoLogger({ message: "saving new user in DB", layer: "DB", name: "User Store", status: "INFO" })
    let firstName = ""
    let lastName = ""
    if (name) {
      const nameArray = name?.split(" ")
      firstName = nameArray[0]
      lastName = nameArray[1]
    }
    const salt = getSalt();
    const hashedPassword: string = await hashPassword(user.password, salt);

    infoLogger({
      message: `SAVE:`, layer: "DB", name: "User Store", status: "INFO"
    })
    console.log({
      ...user,
      name: name,
      firstName: firstName,
      lastName: lastName,
      lastLoginAt: new Date(),
      passwordSalt: salt,
      password: hashedPassword,
    })

    const newUser = await new UserModel({
      ...user,
      name: name,
      firstName: firstName,
      lastName: lastName,
      lastLoginAt: new Date(),
      passwordSalt: salt,
      password: hashedPassword,
    }).save();
    infoLogger({ layer: "DB", status: "success", message: `saved ${user} in db` });

    infoLogger({ layer: "DB", status: "INFO", message: "creating user profile" })
    const response = await userProfileStore.CreateProfile(newUser)
    if (!response.success) {
      return response
    }

    infoLogger({ layer: "DB", status: "success", message: "user profile created successfully" })
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
