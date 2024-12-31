import { Schema, model } from "mongoose";
import { IRFToken } from "@senseii/types";
import { Result } from "types";
import { handleDBError } from "./utils/error";
import { infoLogger } from "@utils/logger";

/**
 * Mongoose schema for the RefreshToken model.
 */
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

/**
 * Mongoose model for the RefreshToken schema.
 */
const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);
export default RefreshTokenModel;

/**
 * Token store object containing methods to interact with the refresh tokens.
 */
export const tokenStore = {
  /**
   * Saves a refresh token for a user.
   * @param token - The refresh token string.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the result of the save operation.
   */
  saveRefreshToken: (token: string, userId: string) =>
    saveRefreshToken(token, userId),
};

/**
 * Saves a refresh token to the database.
 * @param token - The refresh token string.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the result of the save operation.
 */
const saveRefreshToken = async (
  token: string,
  userId: string
): Promise<Result<IRFToken>> => {
  try {
    infoLogger({ status: "INFO", message: "user login -> save refresh token", layer: "DB", name: "RFToken store" })
    const currentDate = new Date();
    const response = await new RefreshTokenModel({
      token: token,
      user: userId,
      expiresAt: currentDate.setDate(currentDate.getDate() + 1),
      createdAt: currentDate,
    }).save();

    infoLogger({ status: "success", message: "user login -> save refresh token", layer: "DB", name: "RFToken store" })
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "RFToken store"),
    };
  }
};
