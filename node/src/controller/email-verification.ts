import { IAuthRequest } from "@middlewares/auth";
import authService from "@services/auth/auth";

/**
 * verifyEmail is triggered when the user manually verifies their email.
 * It checks whether the token returned is valid, and exists in the system.
 * If it exists, marks the user as verified.
*/
const verifyEmail = async (req: IAuthRequest, res: Response) => {
  const token = req.body

  if (!token) {
    return res.status(400).json()
  }

  const result = await authService.verifyEmail()
}
