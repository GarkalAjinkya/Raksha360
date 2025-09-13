import jwt from 'jsonwebtoken';
import env from '../config/env';
import { IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';

// Define token types
export interface TokenPayload {
  userId: string;
  [key: string]: any;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Use environment variables for token TTL
const ACCESS_TOKEN_TTL = env.ACCESS_TOKEN_TTL;
const REFRESH_TOKEN_TTL = env.REFRESH_TOKEN_TTL;

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
};

/**
 * Generate both access and refresh tokens
 */
export const generateAuthTokens = (user: IUser): TokenResponse => {
  const payload: TokenPayload = { userId: user._id.toString() };
  
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  // Calculate expiry in seconds for client
  const decodedToken = jwt.decode(accessToken) as { exp: number };
  const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
  
  return {
    accessToken,
    refreshToken,
    expiresIn
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as TokenPayload;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

/**
 * Verify a verification token from OTP verification
 */
export const verifyVerificationToken = (token: string): { phone: string; otpId: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as { phone: string; otpId: string };
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired verification token');
  }
};