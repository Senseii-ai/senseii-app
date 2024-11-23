import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/crypt";
import {
  AsyncLocalStorage,
  AsyncLocalStorage as asnycLocalStorage,
} from "async_hooks";

type UserContext = Map<string, string>;
const userStorage = new AsyncLocalStorage<UserContext>();

// TODO: Implement Custom Errors
export interface IAuthRequest extends Request {
  userId?: string;
}

export const getUserId = () => {
  const store = userStorage.getStore();
  const userId = store?.get("userId");
  if (!userId) {
    throw new Error("User ID is not available in the current context");
  }
  return userId;
};

// NOTE: This is temporary implementation.
export const authenticateUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("I WAS RUN");
    const store = new Map<string, any>();
    const { userId } = req.body;
    userStorage.run(store, () => {
      store.set("userId", userId);
      next();
    });
  } catch (error) {}
};

// senseii.in
// app.senseii.in

export const authenticateUserMain = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("I WAS RUN");
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.error("Auth Token does not exist");
      res.status(401).json({ message: "Authentication error" });
      return;
    }

    try {
      console.log("VERIFYING TOKEN");
      const userId = verifyToken(token);
      console.log("USER ID", userId);
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
