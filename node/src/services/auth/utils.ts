// import { vfTokenStore } from "@models/verificationToken";
// import { IEmailContent, mailService } from "@services/mail/mailer";
// import { randomBytes } from "crypto";
//
//
// /**
//  * Sends a verification email to the specified email address.
//  *
//  * @param {string} email - The email address to send the verification email to.
//  * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the email was sent successfully.
//  *
//  * @example
//  * // Usage:
//  * const emailSent = await sendVerificationMail("user@example.com");
//  * if (emailSent) {
//  *   // Handle success
//  * } else {
//  *   // Handle error
//  * }
//  *
//  * @description
//  * This function performs the following steps:
//  * 1. Constructs the email content with the verification link.
//  * 2. Calls the `mailService.sendMail` function to send the email.
//  * 3. Returns `true` if the email was sent successfully, otherwise returns `false`.
//  */
// export const sendVerificationMail = async (email: string): Promise<boolean> => {
//   // FIX: repace placeholder email with the actual email address.
//   const token = randomBytes(64).toString("hex")
//   // NOTE: Expecting that saving document wouldn't fail.
//   await vfTokenStore.saveEmailVerificationCode(email, token)
//
//   const verificationLink = `${process.env.FE_URL}/verify-email?token=${token}`
//
//   const emailData: IEmailContent = {
//     subject: "email verification",
//     plainText: "please click the following link to verify your email",
//     html: `
//             <h1>Email Verification</h1>
//             <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
//             <a href="${verificationLink}" target="_blank">Verify Email</a>
//             <p>If the button doesn't work, copy and paste this URL into your browser:</p>
//             <p>${verificationLink}</p>
//         `,
//     recipients: [{ address: "1w1l1.test@inbox.testmail.app" }],
//   };
//   const { success } = await mailService.sendMail(emailData);
//   if (!success) {
//     return false;
//   }
//   return true;
// };
//

