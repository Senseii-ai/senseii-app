import { Schema, model } from "mongoose";
import { IRFToken } from "@senseii/types"

const RefreshTokenSchema: Schema<IRFToken> = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "7d" },
  },
});

const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);
export default RefreshTokenModel;
