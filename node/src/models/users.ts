import mongoose, { Schema } from "mongoose";
import { infoLogger } from "@utils/logger";
import { CreateUserRequest, User, UserModelSchema } from "@senseii/types";
import { getSalt, hashPassword } from "@utils/crypt";
import { Result } from "types";
import { handleDBError } from "./utils/error";

export const userStore = {
  getUserByEmail: (email: string): Promise<Result<User>> => getUserByEmail(email),
  saveNewUser: (user: CreateUserRequest, name?: string): Promise<Result<User>> => saveNewUser(user, name),
  getUserWithPassword: (email: string): Promise<Result<UserModelSchema>> => getUserWithPassword(email),
}

const UserSchema: Schema = new Schema<UserModelSchema>(
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
      type: Date,
      required: true,
    },
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
        };
      },
    },
  }
);

// const saveOAuthUser = async (data: OAuthSigninDTO): Promise<Result<User>> => {
//   try {
//     infoLogger({ message: "OAuth Login", status: "INFO", layer: "DB", name: "User Store" })
//     const [firstName, lastName] = data.name.split(" ")
//     const generatedPassword = generateRandomString(10)
//     const salt = getSalt();
//     const hashedPassword: string = await hashPassword(generatedPassword, salt);
//     const response = await (new UserModel({
//       email: data.email,
//       password: hashedPassword,
//       firstName: firstName,
//       lastName: lastName,
//       lastLoginAt: new Date(),
//     })).save()
//
//     infoLogger({ message: "OAuth Login -> Success", status: "success", layer: "DB", name: "User Store" })
//     return {
//       success: true,
//       data: response.toJSON()
//     }
//   } catch (error) {
//
//     infoLogger({ message: "OAuth Login -> Failed", status: "failed", layer: "DB", name: "User Store" })
//     return {
//       success: false,
//       error: handleDBError(error, "User Store"),
//     };
//   }
// }

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
  name?: string
): Promise<Result<User>> => {
  try {
    let firstName = ""
    let lastName = ""
    if (name) {
      const nameArray = name?.split(" ")
      firstName = nameArray[0]
      lastName = nameArray[1]
    }
    const salt = getSalt();
    const hashedPassword: string = await hashPassword(user.password, salt);
    const newUser = await new UserModel({
      ...user,
      name: name,
      firstName: firstName,
      lastName: lastName,
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
