import { model, Schema } from 'mongoose';

interface User {
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email must be provided'],
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = model('Users', UserSchema);
export default UserModel;
