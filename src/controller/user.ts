import { getUserByEmail } from "../models/users";
import { Request, Response } from "express";
import { z } from "zod";
import { infoLogger } from "../utils/logger/logger";

/**
 * Controller to get a user by email.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    infoLogger({ status: "INFO", message: `get user ${req.body.email}` });
    console.log(req.body);
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

/**
 * Schema for a successful response.
 * @param dataSchema - Zod schema for the data.
 * @returns Zod object schema for the successful response.
 */
const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

/**
 * Schema for an error response.
 */
const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
