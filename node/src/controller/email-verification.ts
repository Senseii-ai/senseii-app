import { IAuthRequest } from "@middlewares/auth";
import { HTTP } from "@senseii/types";
import authService from "@services/auth/auth";
import { infoLogger } from "@utils/logger";
import { Response } from "express";
import { AppError } from "types";

export const authController = {
  verifyEmail: () => verifyEmail
}

/**
 * Verifies a user's email using the provided verification token.
 *
 * @param {IAuthRequest} req - The request object containing the verification token in the body.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response containing either the verification result or an error message.
 *
 * @example
 * // Request body:
 * // {
 * //   "token": "some-verification-token"
 * // }
 *
 * // Success response:
 * // {
 * //   "success": true,
 * //   "data": { ... } // Verified user data
 * // }
 *
 * // Error response:
 * // {
 * //   "success": false,
 * //   "error": "Invalid token"
 * // }
 *
 * @throws {AppError} - Throws an error if the token is missing or invalid.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the verification token is present in the request body.
 * 2. If the token is missing, returns a `400 Bad Request` response with an error message.
 * 3. Calls the `authService.verifyEmail` service to verify the token and update the user's email verification status.
 * 4. Logs the verification process using `infoLogger`.
 * 5. Returns a `200 OK` response with the verification result or an appropriate error response.
 */
export const verifyEmail = async (req: IAuthRequest, res: Response) => {
  infoLogger({ status: "INFO", message: "user verification triggered" })
  const token = req.body

  if (!token) {
    const err: AppError = {
      code: HTTP.STATUS.BAD_REQUEST,
      message: HTTP.STATUS_MESSAGE[HTTP.STATUS.BAD_REQUEST],
      timestamp: new Date(),
    }
    infoLogger({ status: "failed", message: "user verification -> invalid token" })
    return res.status(HTTP.STATUS.BAD_REQUEST).json({ success: false, error: err })
  }

  const response = await authService.verifyEmail(token)
  if (!response.success) {
    infoLogger({ layer: "SERVICE", name: "auth", status: "success", message: "user verification -> success" })
    return res.status(response.error.code).json(response)
  }

  infoLogger({ status: "success", message: "user verification -> success" })
  res.status(HTTP.STATUS.OK).json(response.data)
}
