import { Request, Response, NextFunction } from "express";
import {
  AsyncLocalStorage,
} from "async_hooks";
import { AuthObject, getAuth } from "@clerk/express";
import { infoLogger } from "@utils/logger";

// UserContext interface defines how the userStorage looks.
type UserContext = Map<string, string>;
const userStorage = new AsyncLocalStorage<UserContext>();

// TODO: Implement Custom Errors
/**
 * Represents the request object for authentication-related endpoints.
 */
export interface IAuthRequest extends Request {
  auth?: AuthObject
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
    const { userId, getToken } = getAuth(req)
    const token = await getToken()
    if (!userId || !token) {
      console.error("Auth Token does not exist");
      return res.status(401).json({ message: "Authentication error" });
    }

    try {
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
