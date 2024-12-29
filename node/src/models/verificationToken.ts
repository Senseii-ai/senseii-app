import mongoose, { Document, Schema, Types } from "mongoose"
import { Result } from "types";
import { z } from "zod"
import { handleDBError } from "./utils/error";
import UserProfileModel from "./userInfo";
import { UserModel } from "./users";

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
type EmailVerificatoinToken = z.infer<typeof emailVerificationTokenObject>

interface EmailVerificationDocument extends EmailVerificatoinToken, Document { }

/**
 * EmailVerificationDocument represents the schema followed by the Email verfication documents.
*/
const EmailVerificationSchema = new Schema<EmailVerificationDocument>({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  issueTime: {
    type: String,
    required: true
  },
  expirationTime: {
    type: Number,
    default: 2,
    required: true
  }
})

const EmailVerificationModel = mongoose.model<EmailVerificationDocument>("EmailToken", EmailVerificationSchema)
export default EmailVerificationModel

interface VerifyEmail {
  redirectTo: string
}

export const saveEmailVerificationCode = async (userId: string, token: string): Promise<Result<VerifyEmail>> => {
  try {
    await (new EmailVerificationModel({ userId: userId, token: token, issueTime: new Date().toISOString() }).save())
    return {
      success: true,
      data: {
        redirectTo: "/login"
      }
    }
  } catch (error) {
    return {
      success: false,
      error: handleDBError(error)
    }
  }
}

/**
 * verifyUser verifies the token, if correct, it updates the user status to verified.
*/
export const verifyUser = async (token: string): Promise<Result<Boolean>> => {
  try {
    const user = (await EmailVerificationModel.findOne({ token: token }))?.userId
    // TODO: update User status to verified.
    const verifiedUser = await UserModel.findOneAndUpdate({ id: user }, { verified: true })
  } catch (error) {

  }
}
