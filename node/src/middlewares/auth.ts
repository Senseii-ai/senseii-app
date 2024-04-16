import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/crypt';

// TODO: test if JWT payload can be replaced with a userID string.
export interface IAuthRequest extends Request {
  user?: JwtPayload;
}

// check out JSDoc

export const authenticateUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.error('Auth Token does not exist');
      res.status(401).json({ message: 'Authentication error' });
      return;
    }

    // look into this typescript error later
    try {
      const user = verifyToken(token);
      req.user = user;
    } catch (error) {
      console.error('Token verification failed', error);
      return res.status(403).json({ message: 'Authentication error' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Authentication error' });
  }
};
