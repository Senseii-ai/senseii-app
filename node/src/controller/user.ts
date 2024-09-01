import { UserModel } from "../models/users";
import { Request, Response } from "express";
import {
  comparePassword,
  getAccessToken,
  getRefreshToken,
  hashPassword,
} from "../utils/crypt";

import RefreshTokenModel from "../models/refreshToken";
import Joi from "joi";

export const CreateNewUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(409).json({ message: "email already used" });
    }
    const hashedPassword: string = await hashPassword(password);
    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
    });

    if (!newUser) throw new Error("Unable to SignUp");
    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error("Error in Sign Up", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

    console.log("SENT PASSWORD", password);
    console.log("SAVED PASSWORD", user.password);
    console.log("USER NAME", user.email);

    const responseCheck = comparePassword(password, user.password);
    console.log("responseCheck", responseCheck);

    if (!(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "email or password incorrect" });
    }

    const accessToken = getAccessToken(email);
    const refreshToken = getRefreshToken(email);

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
