import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/crypt";
import { IUserDecoded } from "../types/auth";

// TODO: Implement Custom Errors
export interface IAuthRequest extends Request {
  userId?: string;
}

// check out JSDoc

export const authenticateUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.error("Auth Token does not exist");
      res.status(401).json({ message: "Authentication error" });
      return;
    }

    try {
      const userId = verifyToken(token);
      if (!userId) {
        throw new Error("Error decoding JWT");
      }

      req.userId = userId;
    } catch (error) {
      console.error("Token verification failed", error);
      return res.status(403).json({ message: "Authentication error" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Authentication error" });
  }
};
