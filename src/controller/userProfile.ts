import { getAuth } from "@clerk/express";
import { IAuthRequest } from "@middlewares/auth";
import { userProfileStore } from "@models/userProfile";
import { HTTP, Result, createError, createUserGoalDTO } from "@senseii/types";
import { userProfileService } from "@services/userProfile/userProfileService";
import { infoLogger } from "@utils/logger";
import { Response } from "express";

const layer = "CONTROLLER";
const name = "USER PROFILE";

export const userProfileController = {
  CreateNewGoal: (req: IAuthRequest, res: Response) => createNewGoal(req, res),
  GetUserGoals: (req: IAuthRequest, res: Response) => getUserGoals(req, res)
};

const getUserGoals = async (req: IAuthRequest, res: Response) => {
  infoLogger({ message: `ROUTE: ${req.url} METHOD: ${req.method}` })
  const { userId } = getAuth(req)
  const goals = await userProfileStore.GetUserGoals(req.auth?.userId as string)
  if (!goals.success) {
    const response = {
      success: false,
      error: goals.error
    }
    return void res.status(goals.error.code).json(response)
  }

  infoLogger({ message: "found user goals", status: "success", layer, name })
  return void res.status(HTTP.STATUS.OK).json({
    success: true,
    data: goals.data
  })
}

const createNewGoal = async (
  req: IAuthRequest,
  res: Response
): Promise<Result<null>> => {
  infoLogger({
    message: `ROUTE: ${req.url} METHOD: ${req.method}`,
    status: "INFO",
    layer,
    name,
  });

  const validatedData = createUserGoalDTO.safeParse(req.body);

  if (!validatedData.success) {
    const response = {
      success: false,
      error: createError(HTTP.STATUS.BAD_REQUEST, "invalid request data"),
    };
    res.status(HTTP.STATUS.BAD_REQUEST).json({
      response,
    });
    return {
      success: false,
      error: response.error,
    };
  }

  const response = await userProfileService.CreateNewGoal(validatedData.data);
  if (!response.success) {
    res.status(HTTP.STATUS.INTERNAL_SERVER_ERROR).json({
      response,
    });
    return {
      success: false,
      error: response.error,
    };
  }
  res.status(HTTP.STATUS.OK).json(response)
  return {
    success: true,
    data: null
  }
};
