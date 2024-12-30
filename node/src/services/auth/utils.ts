import { IEmailContent, mailService } from "@services/mail/mailer";


/**
 * Sends a verification email to the specified email address.
 *
 * @param {string} email - The email address to send the verification email to.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the email was sent successfully.
 *
 * @example
 * // Usage:
 * const emailSent = await sendVerificationMail("user@example.com");
 * if (emailSent) {
 *   // Handle success
 * } else {
 *   // Handle error
 * }
 *
 * @description
 * This function performs the following steps:
 * 1. Constructs the email content with the verification link.
 * 2. Calls the `mailService.sendMail` function to send the email.
 * 3. Returns `true` if the email was sent successfully, otherwise returns `false`.
 */
export const sendVerificationMail = async (email: string): Promise<boolean> => {
  // FIX: repace placeholder email with the actual email address.
  const emailData: IEmailContent = {
    subject: "email verification",
    plainText: "please click the following link to verify your email",
    html: `<html>
				<body>
					<h1>click the link to verify your email.</h1>
				</body>
			</html>`,
    recipients: [{ address: "1w1l1.test@inbox.testmail.app" }],
  };
  const { success } = await mailService.sendMail(emailData);
  if (!success) {
    return false;
  }
  return true;
};


