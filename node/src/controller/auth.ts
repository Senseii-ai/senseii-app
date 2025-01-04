import { IAuthRequest } from "@middlewares/auth";
import {
  AppError,
  HTTP,
  OAuthLoginObject,
  Result,
  User,
  UserLoginDTO,
  UserLoginReponseDTO,
  createUserSchema,
  userLoginDTO,
} from "@senseii/types";
import authService from "@services/auth/auth";
import { generateRandomString } from "@utils/crypt";
import { infoLogger } from "@utils/logger";
import { Response } from "express";

/**
 * The authController object contains methods for handling authentication-related requests.
 *
 * @property {Function} verifyEmail - Verifies a user's email using the provided verification token.
 * @property {Function} signup - Signs up a new user using the provided user data.
 * @property {Function} login - Logs in a user using the provided credentials.
 */
export const authController = {
  OAuthLogin: (req: IAuthRequest, res: Response): Promise<Result<UserLoginReponseDTO>> => OAuthLogin(req, res),
  verifyEmail: (req: IAuthRequest, res: Response): Promise<Result<String>> => verifyEmail(req, res),
  signup: (req: IAuthRequest, res: Response): Promise<Result<User>> => signup(req, res),
  login: (req: IAuthRequest, res: Response): Promise<Result<UserLoginReponseDTO>> => loginUser(req, res),
};

const OAuthLogin = async (req: IAuthRequest, res: Response): Promise<Result<UserLoginReponseDTO>> => {
  infoLogger({ status: "INFO", message: "OAuth signin", layer: "CONTROLLER", name: "auth" })
  const validatedUser = OAuthLoginObject.safeParse(req.body);
  if (!validatedUser.success) {
    infoLogger({ status: "failed", message: "OAuth signin -> invalid credentials", layer: "CONTROLLER", name: "auth" })
    const response: Result<Boolean> = {
      success: false,
      error: {
        code: HTTP.STATUS.BAD_REQUEST,
        message: "invalid credentials",
        timestamp: new Date().toISOString(),
      },
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json(response);
    return response;
  }

  // generate random password for system to be consistent with credentials auth.
  const generatedPassword = generateRandomString(10)
  const user: UserLoginDTO = {
    email: validatedUser.data.email,
    name: validatedUser.data.name,
    password: generatedPassword
  }

  const response = await authService.OAuthSignin(user);
  if (!response.success) {
    res.status(response.error.code).json(response.error);
    return response;
  }
  res.status(HTTP.STATUS.OK).json(response);
  infoLogger({ status: "success", message: "OAuth login -> success", layer: "CONTROLLER", name: "auth" })
  return response;
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
export const verifyEmail = async (req: IAuthRequest, res: Response): Promise<Result<String>> => {
  infoLogger({ status: "INFO", message: "user verification triggered" });
  const { token } = req.body;

  if (!token) {
    const err: AppError = {
      code: HTTP.STATUS.BAD_REQUEST,
      message: HTTP.STATUS_MESSAGE[HTTP.STATUS.BAD_REQUEST],
      timestamp: new Date().toISOString(),
    };
    infoLogger({
      status: "failed",
      message: "user verification -> invalid token",
    });
    res
      .status(HTTP.STATUS.BAD_REQUEST)
      .json({ success: false, error: err });
    return {
      success: false,
      error: err
    }
  }

  const response = await authService.verifyEmail(token);
  if (!response.success) {
    infoLogger({
      layer: "SERVICE",
      name: "auth",
      status: "success",
      message: "user verification -> success",
    });
    res.status(response.error.code).json(response);
    return response
  }

  infoLogger({ status: "success", message: "user verification -> success" });
  res.status(HTTP.STATUS.OK).json(response);
  return response
};

/**
 * Signs up a new user using the provided user data.
 *
 * @param {IAuthRequest} req - The request object containing the user data in the body.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Promise<Result<User>>} - A promise that resolves to an HTTP response containing either the created user data or an error message.
 *
 * @example
 * // Request body:
 * // {
 * //   "username": "newuser",
 * //   "password": "password123",
 * //   "email": "newuser@example.com"
 * // }
 *
 * // Success response:
 * // {
 * //   "success": true,
 * //   "data": { ... } // Created user data
 * // }
 *
 * // Error response:
 * // {
 * //   "success": false,
 * //   "error": "Invalid credentials"
 * // }
 *
 * @throws {AppError} - Throws an error if the user data is invalid.
 *
 * @description
 * This function performs the following steps:
 * 1. Validates the user data using the `createUserSchema`.
 * 2. If the user data is invalid, returns a `400 Bad Request` response with an error message.
 * 3. Calls the `authService.createNewUser` service to create a new user.
 * 4. Logs the user creation process using `infoLogger`.
 * 5. Returns a `200 OK` response with the created user data or an appropriate error response.
 */
export const signup = async (
  req: IAuthRequest,
  res: Response
): Promise<Result<User>> => {
  infoLogger({ status: "INFO", message: "create new user" });
  const validatedUser = createUserSchema.safeParse(req.body);
  if (!validatedUser.success) {
    const response: Result<Boolean> = {
      success: false,
      error: {
        code: HTTP.STATUS.BAD_REQUEST,
        message: "invalid credentials",
        timestamp: new Date().toISOString(),
      },
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json(response);
    return response;
  }

  const response = await authService.createNewUser(validatedUser.data);
  if (!response.success) {
    infoLogger({
      layer: "CONTROLLER",
      status: "failed",
      message: `user creation failed: ${response.error.message}`,
    });
    res.status(response.error.code).json(response);
    return response;
  }

  infoLogger({ status: "success", message: "user verification -> success" });
  res.status(HTTP.STATUS.OK).json(response);
  return response;
};

/**
 * Logs in a user using the provided credentials.
 *
 * @param {IAuthRequest} req - The request object containing the user credentials in the body.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Promise<Result<UserLoginReponseDTO>>} - A promise that resolves to an HTTP response containing either the user login data or an error message.
 *
 * @example
 * // Request body:
 * // {
 * //   "username": "existinguser",
 * //   "password": "password123"
 * // }
 *
 * // Success response:
 * // {
 * //   "success": true,
 * //   "data": { ... } // User login data
 * // }
 *
 * // Error response:
 * // {
 * //   "success": false,
 * //   "error": "Invalid credentials"
 * // }
 *
 * @throws {AppError} - Throws an error if the user credentials are invalid.
 *
 * @description
 * This function performs the following steps:
 * 1. Validates the user credentials using the `userLoginDTO`.
 * 2. If the credentials are invalid, returns a `400 Bad Request` response with an error message.
 * 3. Calls the `authService.userLogin` service to log in the user.
 * 4. Returns a `200 OK` response with the user login data or an appropriate error response.
 */
const loginUser = async (
  req: IAuthRequest,
  res: Response
): Promise<Result<UserLoginReponseDTO>> => {
  infoLogger({ status: "INFO", message: "user login", layer: "CONTROLLER", name: "auth" })
  const validatedUser = userLoginDTO.safeParse(req.body);
  if (!validatedUser.success) {
    infoLogger({ status: "failed", message: "user login -> invalid credentials", layer: "CONTROLLER", name: "auth" })
    const response: Result<Boolean> = {
      success: false,
      error: {
        code: HTTP.STATUS.BAD_REQUEST,
        message: "invalid credentials",
        timestamp: new Date().toISOString(),
      },
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json(response);
    return response;
  }

  const response = await authService.userLogin(validatedUser.data);
  if (!response.success) {
    res.status(response.error.code).json(response.error);
    return response;
  }
  res.status(HTTP.STATUS.OK).json(response);
  infoLogger({ status: "success", message: "user login -> success", layer: "CONTROLLER", name: "auth" })
  return response;
};
