import { IAuthRequest } from "@middlewares/auth";
import { createUserGoalDTO } from "@models/temp.types";
import { HTTP, Result, createError } from "@senseii/types";
import { userProfileService } from "@services/userProfile/userProfileService";
import { infoLogger, routeLogger } from "@utils/logger";
import { Response } from "express";

const layer = "CONTROLLER";
const name = "USER PROFILE";

export const userProfileController = {
  CreateNewGoal: (req: IAuthRequest, res: Response) => createNewGoal(req, res),
};

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
