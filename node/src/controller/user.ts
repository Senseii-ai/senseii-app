import { UserModel } from '../models/users';
import { Request, Response } from 'express';
import { hashPassword } from '../utils/crypt';

const CreateNewUser = async (req: Request, res: Response) => {
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
export default CreateNewUser;
