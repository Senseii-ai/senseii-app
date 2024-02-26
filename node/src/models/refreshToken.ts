import { Schema, Types, model } from 'mongoose';

interface RFToken {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<RFToken>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '7d' },
  },
});

const RefreshTokenModel = model('RefreshToken', RefreshTokenSchema);
export default RefreshTokenModel;
