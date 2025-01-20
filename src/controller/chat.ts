import { Response, Request } from "express";
import { infoLogger } from "../utils/logger/logger";
import { z } from "zod";
import { createSSEHandler, setSSEHeaders } from "@utils/http";
import {
  AppError,
  HTTP,
  IChat,
  Result,
  createError,
  serverMessage,
} from "@senseii/types";
import { openAIService } from "@services/openai/service";
import { getAuth } from "@clerk/express";
import { IAuthRequest } from "@middlewares/auth";

export const openAIController = {
  Chat: (req: IAuthRequest, res: Response): Promise<void> => chat(req, res),
  // GetChats: (req: IAuthRequest, res: Response): Promise<Result<IChat[]>> =>
  // getChats(req, res),
  GetChatMessages: (req: IAuthRequest, res: Response): Promise<Result<IChat>> =>
    getChatMessages(req, res),
};

const layer = "CONTROLLER";
const name = "OAI CONTROLLER";

const runCreateDTO = z.object({
  content: z.string(),
  chatId: z.string(),
});

const getChatMessages = async (
  req: IAuthRequest,
  res: Response
): Promise<Result<IChat>> => {
  infoLogger({
    message: `get message for chat: ${req.params.chatId}: user: ${req.auth?.userId}`,
  });
  const { chatId } = req.params;
  const { userId } = getAuth(req);
  if (!chatId || !userId) {
    const response = {
      success: false,
      error: createError(HTTP.STATUS.BAD_REQUEST, "invalid request parameters"),
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json(response);
    return {
      success: false,
      error: response.error,
    };
  }
  const chats = await openAIService.GetChatMessages(chatId, userId);
  res.status(HTTP.STATUS.OK).json(chats);
  return chats;
};

const chat = async (req: Request, res: Response) => {
  infoLogger({
    message: "streamable chat triggered",
    status: "INFO",
    layer,
    name,
  });
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  // set headers
  setSSEHeaders(res);
  // create stream handlers.
  const handler = createSSEHandler(res, requestId);
  const { userId } = getAuth(req);
  if (!userId) {
    const response = {
      success: false,
      error: createError(HTTP.STATUS.UNAUTHORIZED, "Unauthorized"),
    };
    res.status(HTTP.STATUS.UNAUTHORIZED).json(response);
    return;
  }
  const validatedObject = runCreateDTO.safeParse(req.body);
  if (!validatedObject.success) {
    const err: AppError = {
      code: HTTP.STATUS.BAD_REQUEST,
      message: "invalid request",
      timestamp: new Date().toISOString(),
    };
    // FIX: This probably needs to be checked.
    return handler.onError(err);
  }
  // create streamable run.
  const { chatId, content } = validatedObject.data;
  await openAIService.StreamComplete({ chatId, content, userId }, handler);
};

/**
 * getChats returns all the user chats.
 */
// const getChats = async (
//   req: IAuthRequest,
//   res: Response
// ): Promise<Result<IChat[]>> => {
//   infoLogger({
//     message: `getting all ${req.params.email} chats`,
//     status: "INFO",
//     layer,
//     name,
//   });
//   const email = req.params.email;
//   if (!email) {
//     return {
//       success: false,
//       error: createError(HTTP.STATUS.NOT_FOUND, "chats not found")
//     }
//   }
//   const response = await userProfileStore.GetAllChats(email);
//   res.status(HTTP.STATUS.OK).json(response)
//   return response
// };
