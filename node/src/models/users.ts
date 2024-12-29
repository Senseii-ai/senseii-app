import mongoose, { Schema } from "mongoose";
import { infoLogger } from "@utils/logger";
import { CreateUserRequest, User, UserModelSchema } from "@senseii/types";
import { getSalt, hashPassword } from "@utils/crypt";
import { Result } from "types";
import { handleDBError } from "./utils/error";

const UserSchema: Schema = new Schema<UserModelSchema>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email must be provided"],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String
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
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      return {
        email: ret.email,
        firstName: ret.firstName,
        lastName: ret.lastName,
        lastLoginAt: ret.lastLoginAt,
        createdAt: ret.createdAt,
      }
    },
  }
});

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email: email })
}

/**
 * saveNewUserTemp, saves a new user entry in the User collection.
 * @param {CreateUserRequest} user - The object containing required information to create the new user.
 * @returns {Promse<Result<User>>} User object returned after saving the document in the DB.
*/
export const saveNewUserTemp = async (user: CreateUserRequest): Promise<Result<User>> => {
  try {
    const salt = getSalt()
    const hashedPassword: string = await hashPassword(user.password, salt);
    const newUser = await (new UserModel({ ...user, lastLoginAt: new Date, passwordSalt: salt, password: hashedPassword }).save())
    infoLogger({ layer: "DB", status: "INFO", message: `saved ${user} in db` })
    return {
      success: true,
      data: newUser.toJSON()
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error)
    }
  }
}

export const saveNewUser = async (user: CreateUserRequest) => {
  infoLogger({ status: "INFO", message: "save new user", layer: "DB" })
  try {
    const salt = getSalt()
    const hashedPassword: string = await hashPassword(user.password, salt);
    const newUser = await (new UserModel({ ...user, lastLoginAt: new Date, passwordSalt: salt, password: hashedPassword }).save())
    infoLogger({ layer: "DB", status: "INFO", message: `saved ${user} in db` })
    return newUser
  } catch (error) {
    infoLogger({ layer: "DB", status: "failed", message: `unable to save ${user} in db` })
    throw error
  }
}


// export const getUserByEmail = async (email: string) => {
//   const user = await UserModel.findOne({ email: email });
//   if (!user) {
//     infoLogger({ status: "failed", message: "Error finding user" })
//     throw new Error("Error finding user");
//   }
//   // FIX: replace with UserDTO
//   const userDTO: User = {
//     id: user.id,
//     email: user.email,
//     password: user.password,
//     salt: user.salt,
//     accessToken: user.accessToken,
//   };
//
//   return userDTO;
// };

export const UserModel = mongoose.model<UserModelSchema>("Users", UserSchema);
