import mongoose, { Schema } from "mongoose";
import { infoLogger } from "@utils/logger";
import { CreateUserRequest, UserModelSchema } from "@senseii/types";
import { getSalt, hashPassword } from "@utils/crypt";

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
});

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email: email })
}

export const saveNewUser = async (user: CreateUserRequest) => {
  try {
    const salt = getSalt()
    const hashedPassword: string = await hashPassword(user.password, salt);
    const newUser = await (new UserModel({ ...user, lastLoginAt: new Date, passwordSalt: salt, password: hashedPassword }).save())
    infoLogger({ status: "INFO", message: `saved ${user} in db` })
    return newUser
  } catch (error) {
    infoLogger({ status: "failed", message: "unable to save ${user} in db" })
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
