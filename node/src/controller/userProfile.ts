import { IAuthRequest } from "@middlewares/auth";
import { userProfileStore } from "@models/userProfile";
import { AppError, HTTP, IChat, Result, createError, message, userChat } from "@senseii/types";
import { infoLogger, routeLogger } from "@utils/logger";
import { Response } from "express";

const layer = "CONTROLLER"
const name = "USER PROFILE"

export const userProfileController = {
  SaveChat: (req: IAuthRequest, res: Response) => saveChat(req, res),
};

const saveChat = async (
  req: IAuthRequest,
  res: Response
): Promise<Result<string>> => {
  routeLogger(req.url, req.method)
  infoLogger({ message: `create new chat: ${req.params.email}`, status: "INFO", layer, name })
  console.log("GOT THIS:::", req.body)
  const { chat }: { chat: IChat } = req.body;
  chat.messages?.map(item => console.log(item))
  const validatedData = userChat.safeParse(chat);
  if (!validatedData.success) {
    infoLogger({ message: `invalid input object`, status: "failed", layer, name })
    console.log("ERROR::::", validatedData.error)
    const err: AppError = createError(HTTP.STATUS.BAD_REQUEST, "invalid input");
    const response: Result<null> = {
      success: false,
      error: err,
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json(response);
    return response;
  }

  // since FE doesn't have direct access to the userid.
  validatedData.data.userId = req.userId as string

  const response = await userProfileStore.AddChatToUser(validatedData.data, req.userId as string);
  if (!response.success) {
    res.status(response.error.code).json(response.error)
  }

  infoLogger({ message: "created new chat", status: "success", layer, name })
  res.status(HTTP.STATUS.OK).json(response)
  return response
};
