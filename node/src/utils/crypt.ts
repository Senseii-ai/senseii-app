import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getRefreshToken = (userId: string) => {
  return jwt.sign(userId, getRefreshTokenKey());
};

const getRefreshTokenKey = (): string => {
  const RefreshTokenKey = process.env.REFRESH_TOKEN_KEY;

  if (!RefreshTokenKey) {
    console.error("Unable to find Refresh Token Signing Key");
    throw new Error("Internal Server Error");
  }
  return RefreshTokenKey;
};

export const getAccessToken = (userId: string) => {
  return jwt.sign(userId, getAccessTokenKey());
};

const getAccessTokenKey = (): string => {
  const AccessTokenKey = process.env.ACCESS_TOKEN_KEY;
  if (!AccessTokenKey) {
    console.log("Unable to find Signing token Key");
    throw new Error("Internal Server Error");
  }
  return AccessTokenKey;
};

export const getSalt = (): string => {
  return bcrypt.genSaltSync(10);
};

export const comparePassword = async (
  userPassword: string,
  savedPassword: string,
): Promise<Boolean> => {
  return await bcrypt.compare(userPassword, savedPassword);
};

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

export const verifyToken = (token: string): string => {
  try {
    const payload = jwt.verify(token, getAccessTokenKey());
    return payload as string;
  } catch (error) {
    console.error("Token Verification failed", error);
    throw new Error("Invalid token");
  }
};
