import mongoose, { Schema } from "mongoose";
import { User } from "@senseii/types"
import { infoLogger } from "@utils/logger";

const UserSchema: Schema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email must be provided"],
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    unique: true,
  },
});

export const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    infoLogger({ status: "failed", message: "Error finding user" })
    throw new Error("Error finding user");
  }
  const userDTO: User = {
    id: user.id,
    email: user.email,
    password: user.password,
    salt: user.salt,
    accessToken: user.accessToken,
  };

  return userDTO;
};

export const UserModel = mongoose.model<User>("Users", UserSchema);
