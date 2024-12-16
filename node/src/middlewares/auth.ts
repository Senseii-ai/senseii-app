import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/crypt";
import {
  AsyncLocalStorage,
} from "async_hooks";

// UserContext interface defines how the userStorage looks.
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

export const authenticateUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"] as string;

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      console.error("Auth Token does not exist");
      return res.status(401).json({ message: "Authentication error" });
    }

    try {
      const userId = verifyToken(token);
      if (!userId) {
        throw new Error("Error decoding JWT");
      }

      const store = new Map<string, any>();
      userStorage.run(store, () => {
        store.set("userId", userId);
        req.userId = userId;
        next(); // Call next only inside the correct flow
      });
    } catch (error) {
      console.error("Token verification failed", error);
      return res.status(403).json({ message: "Authentication error" });
    }
  } catch (error) {
    console.error("Unexpected error", error);
    return res.status(400).json({ message: "Authentication error" });
  }
};
