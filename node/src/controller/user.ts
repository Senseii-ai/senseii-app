import { UserModel } from '../models/users';
import { Request, Response } from 'express';
import {
  comparePassword,
  getAccessToken,
  getRefreshToken,
  hashPassword,
} from '../utils/crypt';
import RefreshTokenModel from '../models/refreshToken';

export const CreateNewUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(409).json({ message: 'email already used' });
    }
    const hashedPassword: string = await hashPassword(password);
    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
    });

    if (!newUser) throw new Error('Unable to SignUp');
    res.status(201).json({ message: 'User Created Successfully' });
  } catch (error) {
    console.error('Error in Sign Up', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    console.log('this is user', user);
    if (!user) {
      return res.status(400).json({ message: 'User not Found' });
    }

    if (!(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'email or password incorrect' });
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

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Internal Server Error' });
  }
};
