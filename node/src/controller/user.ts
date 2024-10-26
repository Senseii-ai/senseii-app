import { UserModel, getUserByEmail } from "../models/users";
import { Request, Response } from "express";
import {
  comparePassword,
  getAccessToken,
  getRefreshToken,
  hashPassword,
} from "../utils/crypt";

import RefreshTokenModel from "../models/refreshToken";
import Joi from "joi";
import UserProfileModel from "../models/userInfo";
import { infoLogger } from "../utils/logger/logger";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body;
    infoLogger({
      message: `Get user ${email}`,
    });

    const user = await getUserByEmail(email);
    infoLogger({
      message: "User Found",
      status: "success",
    });

    res.status(201).json({
      status: "success",
      message: "User Found Successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error finding user", error);
    res.status(404).json({
      status: "error",
      message: "User Not Found",
      data: null,
    });
  }
};

// FIX: add zod validator here
export const CreateNewUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    salt,
  }: { email: string; password: string; salt: string } = req.body;

  infoLogger({ message: `Creating User %{email}` });

  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ status: "failed", message: "email already used" });
    }
    const hashedPassword: string = await hashPassword(password, salt);
    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      salt: salt,
    });

    const newUserProfile = await UserProfileModel.create({
      user: newUser.id,
      chats: [],
    });

    if (!newUserProfile) throw new Error("Unable to create User profile");
    if (!newUser) throw new Error("Unable to SignUp");
    infoLogger({ message: `New user created Successfully`, status: "success" });

    res
      .status(201)
      .json({ type: "success", message: "User Created Successfully" });
  } catch (error) {
    console.error("Error in Sign Up", error);
    return res.status(500).json({ type: "failed", message: error });
  }
};

// TODO: implement validate route for accessToken.

// userLoginCredsSchema is a Joi schema to validate the request body
const userLoginCredsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// TODO: Implement proper response types, telling if the request was successful or not.
export const LoginUser = async (req: Request, res: Response) => {
  console.log("this is req.body", req.body);

  // validate if the request body is valid.
  const isValid = userLoginCredsSchema.validate(req.body);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid Request Body" });
  }

  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User not Found" });
    }

    const responseCheck = comparePassword(password, user.password);

    if (!(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "email or password incorrect" });
    }

    const accessToken = getAccessToken(user.id);
    const refreshToken = getRefreshToken(user.id);

    const currentDate = new Date();
    const expiresAt = currentDate.setDate(currentDate.getDate() + 7);

    await RefreshTokenModel.create({
      token: refreshToken,
      user: user,
      expiresAt: expiresAt,
    });

    const userId = user._id;
    return res.status(200).json({ accessToken, refreshToken, userId });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
};
