import { verifyUser } from "@models/verificationToken"
import { User } from "@senseii/types"
import { Result } from "types"

const authService = {
  verifyEmail: (token: string): Promise<Result<User>> => {
    return verifyUser(token)
  }
}

export default authService 
