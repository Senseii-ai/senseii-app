import mongoose, { Document, Schema, Types } from "mongoose";
import { Result } from "types";
import { z } from "zod";
import { handleDBError } from "./utils/error";
import UserProfileModel from "./userInfo";
import { UserModel } from "./users";
import { User, UserDTO, UserModelSchema } from "@senseii/types";

/**
 * Represents an email verification token object.
 * Used for validating and managing email verification processes.
 */
const emailVerificationTokenObject = z.object({
  /**
   * The unique identifier for the user associated with this token.
   */
  userId: z.string(),

  /**
   * A secure token string used for email verification.
   * Must be at least 128 characters long.
   */
  token: z.string().min(128),

  /**
   * The time the token was issued, in ISO 8601 format.
   */
  issueTime: z.string().datetime(),

  /**
   * The duration (in hours) for which the token is valid.
   * Defaults to 2 hours if not provided.
   */
  expirationTime: z.number().default(2),
});

/**
 * type EmailVerificationToken
 */
type EmailVerificatoinToken = z.infer<typeof emailVerificationTokenObject>;

interface EmailVerificationDocument extends EmailVerificatoinToken, Document {}

/**
 * EmailVerificationDocument represents the schema followed by the Email verfication documents.
 */
const EmailVerificationSchema = new Schema<EmailVerificationDocument>({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  issueTime: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Number,
    default: 2,
    required: true,
  },
});

const EmailVerificationModel = mongoose.model<EmailVerificationDocument>(
  "EmailToken",
  EmailVerificationSchema
);
export default EmailVerificationModel;

interface VerifyEmail {
  redirectTo: string;
}

export const saveEmailVerificationCode = async (
  userId: string,
  token: string
): Promise<Result<VerifyEmail>> => {
  try {
    await new EmailVerificationModel({
      userId: userId,
      token: token,
      issueTime: new Date().toISOString(),
    }).save();
    return {
      success: true,
      data: {
        redirectTo: "/login",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "VFToken Store"),
    };
  }
};

/**
 * Verifies a user by checking the provided email verification token and updating the user's verified status.
 *
 * @param {string} token - The email verification token sent to the user.
 * @returns {Promise<Result<UserDTO>>} - A promise that resolves to a `Result` object containing either the verified user data or an error message.
 *
 * @example
 * const result = await verifyUser("some-verification-token");
 * if (result.success) {
 *   console.log("User verified:", result.data);
 * } else {
 *   console.error("Error:", result.error);
 * }
 *
 * @throws {Error} - Throws an error if the token is invalid or expired, or if the user is not found.
 *
 * @description
 * This function performs the following steps:
 * 1. Finds the email verification token in the database.
 * 2. If the token is valid, updates the corresponding user's `verified` status to `true`.
 * 3. Returns the updated user data as a DTO (Data Transfer Object).
 * 4. Handles and returns specific errors for invalid tokens, missing users, and database issues.
 */
export const verifyUser = async (token: string): Promise<Result<User>> => {
  try {
    const user = (await EmailVerificationModel.findOne({ token: token }))
      ?.userId;
    if (!user) {
      throw new Error("Invalid or expired token");
    }
    const verifiedUser = await UserModel.findOneAndUpdate(
      { id: user },
      { verified: true },
      { new: true }
    );
    if (!verifiedUser) {
      throw new Error("User not found");
    }
    return {
      success: true,
      data: verifiedUser.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error, "VFToken Verify"),
    };
  }
};
