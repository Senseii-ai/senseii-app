import mongoose, { Schema } from "mongoose";

interface User {
  email: string;
  password: string;
  accessToken?: string;
  salt: string;
}

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
    console.error("Error finding user");
    throw new Error("Error finding user");
  }
  return user;
};

export const UserModel = mongoose.model<User>("Users", UserSchema);
