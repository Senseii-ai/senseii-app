import { getUserByEmail, saveNewUser } from "../models/users";
import { Request, Response } from "express";
import {
  comparePassword,
  getAccessToken,
  getRefreshToken,
} from "@utils/crypt";
import { z } from "zod";

import RefreshTokenModel from "@models/refreshToken";
import { UserProfileModelSchema, saveNewUserProfile } from "../models/userInfo";
import { infoLogger } from "../utils/logger/logger";
import { User, createUserSchema, userLoginDTO } from "@senseii/types";
import { HTTP } from "@utils/http";
import authService from "@services/auth/auth";
import { Result } from "types";

export const getUser = async (req: Request, res: Response) => {
  try {
    infoLogger({ status: "INFO", message: `get user ${req.body.email}` })
    console.log(req.body)
    const { email }: { email: string } = req.body;
    infoLogger({
      message: `Get user ${email}`,
    });

    const user = await getUserByEmail(email);
    infoLogger({
      message: "User Found",
      status: "success",
    });

    res.status(201).json({
      status: "success",
      message: "User Found Successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error finding user", error);
    res.status(404).json({
      status: "error",
      message: "User Not Found",
      data: null,
    });
  }
};

export const createNewUserTemp = async (req: Request, res: Response): Promise<Result<User>> => {
  infoLogger({ status: "INFO", message: "create new user" })
  const validatedUser = createUserSchema.safeParse(req.body)
  if (!validatedUser.success) {
    const response: Result<Boolean> = {
      success: false,
      error: {
        code: HTTP.STATUS.BAD_REQUEST,
        message: "invalid credentials",
        timestamp: new Date()
      }
    }
    res.status(HTTP.STATUS.BAD_REQUEST).json(response)
    return response
  }

  const response = await authService.createNewUser(validatedUser.data)
  if (!response.success) {
    infoLogger({ layer: "CONTROLLER", status: "failed", message: `user creation failed: ${response.error.message}` })
    res.status(response.error.code).json(response)
    return response
  }

  infoLogger({ status: "success", message: "user verification -> success" })
  res.status(HTTP.STATUS.OK).json(response.data)
  return response
}

// createNewUser creates a new User and it's related profile.
export const createNewUser = async (req: Request, res: Response) => {
  infoLogger({ status: "INFO", message: "create new user" });
  try {
    const validatedUser = createUserSchema.parse(req.body)
    infoLogger({ status: "INFO", message: `create user ${validatedUser.email}` });
    const existingUser = await getUserByEmail(validatedUser.email)
    if (existingUser) {
      const responseObject: ErrorResponse = {
        success: false,
        error: {
          code: HTTP.STATUS_MESSAGE[HTTP.STATUS.CONFLICT],
          message: "user alredy exists",
          details: ""
        }
      }
      infoLogger({ status: "failed", message: 'user already exists' })
      return res.status(HTTP.STATUS.CONFLICT).json(responseObject)
    }

    const newUser = await saveNewUser(validatedUser)
    const newProfile: UserProfileModelSchema = {
      id: newUser.id,
      chats: [],
      createdAt: new Date(newUser.createdAt),
      updatedAt: new Date(newUser.updatedAt),
      email: newUser.email,
      firstName: newUser.firstName,
      verified: false,
      lastName: newUser.lastName
    }

    const result = await saveNewUserProfile(newProfile)
    if (!result) {
      const responseObject: ErrorResponse = {
        success: false,
        error: {
          message: "error creating user",
          code: HTTP.STATUS.INTERNAL_SERVER_ERROR.toString(),
          details: ""
        }
      }
      res.status(HTTP.STATUS.INTERNAL_SERVER_ERROR).json(responseObject)
    }

    infoLogger({ message: `user ${validatedUser.email} created successfully`, status: "success" });

    type SuccessResponse = z.infer<ReturnType<typeof SuccessResponseSchema>>
    const responseObject: SuccessResponse = {
      success: true,
      data: "user create successfully"
    }
    res.status(HTTP.STATUS.OK).json(
      responseObject
    )
    return
  } catch (error) {
    infoLogger({ status: "failed", message: error as string })
    const responseObject: ErrorResponse = {
      success: false,
      error: {
        message: "error creating user",
        code: HTTP.STATUS.INTERNAL_SERVER_ERROR.toString(),
        details: ""
      }
    }
    return res.status(HTTP.STATUS.INTERNAL_SERVER_ERROR).json(responseObject)
  }
};

const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.literal(true),
  data: dataSchema
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  })
});

type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// TODO: Implement proper response types, telling if the request was successful or not.
export const loginUser = async (req: Request, res: Response) => {
  try {
    const validateUser = userLoginDTO.safeParse(req.body)
    if (!validateUser.success) {
      infoLogger({ status: "failed", message: "invalid credentials" })
      const responseObject: ErrorResponse = {
        success: false,
        error: {
          code: HTTP.STATUS.BAD_REQUEST.toString(),
          message: "invalid credentials",
          details: ""
        }
      }
      return res.status(HTTP.STATUS.BAD_REQUEST).json(responseObject)
    }
    infoLogger({ status: "INFO", message: `login attempt by ${validateUser.data?.email}` })
    const user = await getUserByEmail(validateUser.data?.email)
    if (!user) {
      infoLogger({ status: "failed", message: "user not found" })
      const responseObject: ErrorResponse = {
        success: false,
        error: {
          code: HTTP.STATUS.NOT_FOUND.toString(),
          message: HTTP.STATUS_MESSAGE[HTTP.STATUS.NOT_FOUND],
          details: ""
        }
      }
      return res.status(HTTP.STATUS.NOT_FOUND).json(responseObject);
    }

    if (!(await comparePassword(validateUser.data.password, user.password))) {
      const responseObject: ErrorResponse = {
        success: false,
        error: {
          code: HTTP.STATUS.BAD_REQUEST.toString(),
          message: "invalid user email or password",
          details: ""
        }
      }

      return res.status(HTTP.STATUS.BAD_REQUEST).json(responseObject);
    }

    // TODO: Implement expiring tokens
    const accessToken = getAccessToken(user.id);
    const refreshToken = getRefreshToken(user.id);

    const currentDate = new Date()
    const expiresAt = currentDate.setDate(currentDate.getDate() + 1);

    await RefreshTokenModel.create({
      token: refreshToken,
      user: user,
      expiresAt: expiresAt,
    });

    // FIX: maybe extract this to another function.
    type SuccessResponse = z.infer<ReturnType<typeof SuccessResponseSchema>>
    const responseObject: SuccessResponse = {
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken
      },
    }
    return res.status(HTTP.STATUS.OK).json(responseObject)
  } catch (error) {
    console.error(error);
    const responseObject: ErrorResponse = {
      success: false,
      error: {
        code: HTTP.STATUS.INTERNAL_SERVER_ERROR.toString(),
        message: HTTP.STATUS_MESSAGE[HTTP.STATUS.INTERNAL_SERVER_ERROR],
        details: ""
      }
    }
    return res.status(HTTP.STATUS.INTERNAL_SERVER_ERROR).json(responseObject)
  }
};
