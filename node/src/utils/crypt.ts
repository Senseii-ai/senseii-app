import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const getRefreshToken = (email: string) => {
  return jwt.sign(email, getRefreshTokenKey());
};

const getRefreshTokenKey = (): string => {
  const RefreshTokenKey = process.env.REFRESH_TOKEN_KEY;

  if (!RefreshTokenKey) {
    console.error('Unable to find Refresh Token Signing Key');
    throw new Error('Internal Server Error');
  }
  return RefreshTokenKey;
};

export const getAccessToken = (email: string) => {
  return jwt.sign(email, getAccessTokenKey());
};

const getAccessTokenKey = (): string => {
  const AccessTokenKey = process.env.ACCESS_TOKEN_KEY;
  if (!AccessTokenKey) {
    console.log('Unable to find Signing token');
    throw new Error('Internal Server Error');
  }
  return AccessTokenKey;
};

const getSalt = (): string => {
  return bcrypt.genSaltSync(10);
};

export const comparePassword = async (
  userPassword: string,
  savedPassword: string
): Promise<Boolean> => {
  return await bcrypt.compare(userPassword, savedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, getSalt());
};

export const verifyToken = (token: string): string | JwtPayload => {
  try {
    return jwt.verify(token, getAccessTokenKey());
  } catch (error) {
    console.error('Token Verification failed', error);
    throw new Error('Invalid token');
  }
};
