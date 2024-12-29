import { saveNewUserTemp } from "@models/users"
import { verifyUser } from "@models/verificationToken"
import { CreateUserRequest, HTTP, User } from "@senseii/types"
import { IEmailContent, mailService } from "@services/mail/mailer"
import { infoLogger } from "@utils/logger"
import { Result } from "types"

const authService = {
  verifyEmail: async (token: string): Promise<Result<User>> => {
    return await verifyUser(token)
  },
  createNewUser: async (data: CreateUserRequest): Promise<Result<User>> => {
    infoLogger({ status: "INFO", layer: "SERVICE", name: "auth", message: "create user" })
    const response = await saveNewUserTemp(data)
    // if user not saved in DB, return error without initiating user verification.
    if (!response.success) {
      return response
    }

    // initiate user verification.
    const isSuccess = await sendVerificationMail(response.data.email)
    // if error in sending email, return internal server error.
    if (!isSuccess) {
      return {
        success: false,
        error: {
          code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
          message: "internal server error",
          timestamp: new Date(),
        }
      }
    }

    // return user information if the entire flow works ok.
    return response
  },
}

// FIX: replace placeholder email with actual user emails. And, maybe this need try catch.
const sendVerificationMail = async (email: string): Promise<boolean> => {
  const emailData: IEmailContent = {
    subject: "email verification",
    plainText: "please click the following link to verify your email",
    html: `<html>
				<body>
					<h1>click the link to verify your email.</h1>
				</body>
			</html>`,
    recipients: [{ address: "1w1l1.test@inbox.testmail.app" }]
  }
  const { success } = await mailService.sendMail(emailData)
  if (!success) {
    return false
  }
  return true
}

export default authService 
