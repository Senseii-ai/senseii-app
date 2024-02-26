import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
  email: string;
  password: string;
  accessToken?: string;
}

const UserSchema: Schema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email must be provided'],
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    unique: true,
  },
});

export const UserModel = mongoose.model<User>('Users', UserSchema);
