import { saveEmailVerificationCode, verifyUser } from "@models/verificationToken"
import { Result } from "types"

interface verifyEmail {
  redirectTo: string
}

const authService = {
  verifyEmail: (token: string): Promise<Result<verifyEmail>> => {
    console.log("Hello")
    return verifyUser(token)
  }
}

export default authService 
