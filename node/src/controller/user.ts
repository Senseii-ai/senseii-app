import UserSchema from '../models/users';
import { Request, Response } from 'express';

const addNewUser = async (req: Request, res: Response) => {
  const user = new UserSchema({
    email: 'prateksingh9741@gmailll.com',
    password: '12345',
  });

  await user.save();
  res.send('User Added successfully');
};

export default addNewUser;
