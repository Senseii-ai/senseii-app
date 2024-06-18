import { Types } from 'mongoose';

export interface IRFToken {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUserDecoded {
  userName: string;
  userId: Types.ObjectId
}


