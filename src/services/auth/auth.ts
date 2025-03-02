// import { userStore } from "@models/users";
// import { verifyUser } from "@models/verificationToken";
// import {
//   CreateUserRequest,
//   HTTP,
//   OAuthSigninDTO,
//   Result,
//   User,
//   UserLoginDTO,
//   UserLoginReponseDTO,
// } from "@senseii/types";
// import { infoLogger } from "@utils/logger";
// // import { sendVerificationMail } from "./utils";
// import {
//   comparePassword,
//   getAuthTokens,
// } from "@utils/crypt";
// import { tokenStore } from "@models/refreshToken";
//
// /**
//  * AuthService provides methods for user authentication and management.
//  *
//  * @description
//  * This service includes methods for:
//  * 1. Verifying a user's email using a verification token.
//  * 2. Creating a new user and initiating the email verification process.
//  * 3. Logging in a user using the provided credentials.
//  * 4. Logging in a user using OAuth Credentials.
//  */
// const authService = {
//   OAuthSignin: (data: OAuthSigninDTO): Promise<Result<UserLoginReponseDTO>> => OAuthSignin(data),
//   createNewUser: (data: CreateUserRequest): Promise<Result<User>> => createNewUser(data),
//   userLogin: (data: UserLoginDTO): Promise<Result<UserLoginReponseDTO>> => userLogin(data),
//   verifyEmail: (token: string): Promise<Result<String>> => verifyEmail(token),
// };
//
// const OAuthSignin = async (data: OAuthSigninDTO): Promise<Result<UserLoginReponseDTO>> => {
//   infoLogger({ message: "OAuth login", layer: "SERVICE", name: "AUTH", status: "INFO" })
//   const existingUser = await userStore.getUserByEmail(data.email);
//   // User does not exist, save them.
//   if (!existingUser.success) {
//
//     const newUser: CreateUserRequest = {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       verified: true,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//
//     const user = await userStore.saveNewUser(newUser, true, data.name)
//     if (!user.success) {
//       return user
//     }
//
//
//     const { id: userId, name, verified, email } = user.data;
//
//     const { accessToken, refreshToken } = getAuthTokens(userId);
//     const response = await tokenStore.saveRefreshToken(refreshToken, userId);
//     if (!response.success) {
//       return response;
//     }
//
//
//     infoLogger({ message: "OAuth login -> Success", layer: "SERVICE", name: "AUTH", status: "success" })
//     return {
//       success: true,
//       data: {
//         name: name,
//         id: userId,
//         verified: verified,
//         email: email,
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//       },
//     };
//   }
//
//   const { id: userId, verified, name, email } = existingUser.data;
//   // TODO: implement expiring tokens
//   const { accessToken, refreshToken } = getAuthTokens(userId);
//   const response = await tokenStore.saveRefreshToken(refreshToken, userId);
//
//   if (!response.success) {
//     return response;
//   }
//
//   return {
//     success: true,
//     data: {
//       id: userId,
//       name: name,
//       verified: verified,
//       email: email,
//       accessToken: accessToken,
//       refreshToken: refreshToken,
//     },
//   };
// }
//
// /**
//  * Logs in a user using the provided credentials.
//  *
//  * @param {UserLoginDTO} data - The user login data containing email and password.
//  * @returns {Promise<Result<UserLoginReponseDTO>>} - A promise that resolves to a result containing either the user login data or an error message.
//  *
//  * @example
//  * // Usage:
//  * const result = await authService.userLogin({
//  *   email: "existinguser@example.com",
//  *   password: "password123"
//  * });
//  * if (result.success) {
//  *   // Handle success
//  * } else {
//  *   // Handle error
//  * }
//  *
//  * @description
//  * This function performs the following steps:
//  * 1. Retrieves the user data with the password from the user store.
//  * 2. Compares the provided password with the stored password.
//  * 3. If the password is incorrect, returns a `400 Bad Request` response with an error message.
//  * 4. Generates access and refresh tokens for the user.
//  * 5. Saves the refresh token in the token store.
//  * 6. Returns the user login data if the entire process is successful.
//  */
// const userLogin = async (
//   data: UserLoginDTO
// ): Promise<Result<UserLoginReponseDTO>> => {
//   const existingUser = await userStore.getUserWithPassword(data.email);
//   if (!existingUser.success) {
//     return existingUser;
//   }
//
//   if (!(await comparePassword(data.password, existingUser.data.password))) {
//     infoLogger({ status: "failed", message: "user login -> user found -> wrong password", layer: "SERVICE", name: "auth" })
//     return {
//       success: false,
//       error: {
//         code: HTTP.STATUS.BAD_REQUEST,
//         message: "wrong username or password",
//         timestamp: new Date().toISOString(),
//       },
//     };
//   }
//
//   const { id: userId, name, verified, email } = existingUser.data;
//   // TODO: implement expiring tokens
//   const { accessToken, refreshToken } = getAuthTokens(userId);
//   const response = await tokenStore.saveRefreshToken(refreshToken, userId);
//   if (!response.success) {
//     return response;
//   }
//
//   return {
//     success: true,
//     data: {
//       id: userId,
//       name: name,
//       verified: verified,
//       email: email,
//       accessToken: accessToken,
//       refreshToken: refreshToken,
//     },
//   };
// };
//
// /**
//  * Verifies a user's email using the provided verification token.
//  *
//  * @param {string} token - The verification token to verify the user's email.
//  * @returns {Promise<Result<User>>} - A promise that resolves to a result containing either the verified user data or an error message.
//  *
//  * @example
//  * // Usage:
//  * const result = await authService.verifyEmail("some-verification-token");
//  * if (result.success) {
//  *   // Handle success
//  * } else {
//  *   // Handle error
//  * }
//  *
//  * @description
//  * This function performs the following steps:
//  * 1. Calls the `verifyUser` function to verify the token and update the user's email verification status.
//  * 2. Returns the result of the verification process.
//  */
// const verifyEmail = async (token: string): Promise<Result<String>> => {
//   return await verifyUser(token);
// };
//
// /**
//  * Creates a new user and initiates the email verification process.
//  *
//  * @param {CreateUserRequest} data - The user data required to create a new user.
//  * @returns {Promise<Result<User>>} - A promise that resolves to a result containing either the created user data or an error message.
//  *
//  * @example
//  * // Usage:
//  * const result = await authService.createNewUser({
//  *   username: "newuser",
//  *   password: "password123",
//  *   email: "newuser@example.com"
//  * });
//  * if (result.success) {
//  *   // Handle success
//  * } else {
//  *   // Handle error
//  * }
//  *
//  * @description
//  * This function performs the following steps:
//  * 1. Calls the `saveNewUser` function to save the new user data temporarily.
//  * 2. If the user data is not saved successfully, returns the error response.
//  * 3. Initiates the email verification process by calling the `sendVerificationMail` function.
//  * 4. If there is an error in sending the verification email, returns an internal server error response.
//  * 5. Returns the created user data if the entire process is successful.
//  */
// const createNewUser = async (
//   data: CreateUserRequest
// ): Promise<Result<User>> => {
//   infoLogger({
//     status: "INFO",
//     layer: "SERVICE",
//     name: "auth",
//     message: "create user",
//   });
//   const response = await userStore.saveNewUser(data, false, "");
//   // if user not saved in DB, return error without initiating user verification.
//   if (!response.success) {
//     return response;
//   }
//
//   // initiate user verification.
//   // const emailSent = await sendVerificationMail(response.data.email);
//   // // if error in sending email, return internal server error.
//   // if (!emailSent) {
//   //   return {
//   //     success: false,
//   //     error: {
//   //       code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
//   //       message: "internal server error",
//   //       timestamp: new Date().toISOString(),
//   //     },
//   //   };
//   // }
//   //
//   // return user information if the entire flow works ok.
//   return response;
// };
//
// export default authService;
