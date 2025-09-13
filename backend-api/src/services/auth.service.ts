import bcrypt from 'bcrypt';
import { User, IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';
import * as tokenService from './token.service';
import env from '../config/env';
import { verifyVerificationToken } from './token.service';

/**
 * Register a new user
 */
export const register = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  verificationToken: string;
  emergencyContacts?: Array<{ name: string; phone: string; relation: string }>;
}) => {
  // Verify the verification token from OTP verification
  const { phone: verifiedPhone } = verifyVerificationToken(userData.verificationToken);
  
  // Ensure the phone in the token matches the one in the request
  if (verifiedPhone !== userData.phone) {
    throw new ApiError(400, 'Phone number does not match the verified phone number');
  }
  
  // Check if user already exists with this email or phone
  const existingUser = await User.findOne({
    $or: [
      { email: userData.email.toLowerCase() },
      { phone: userData.phone }
    ]
  });
  
  if (existingUser) {
    throw new ApiError(409, 'User with this email or phone already exists');
  }
  
  // Hash the password
  const passwordHash = await bcrypt.hash(userData.password, env.BCRYPT_SALT_ROUNDS);
  
  // Create the user
  const user = await User.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    phone: userData.phone,
    phoneVerified: true, // Phone is verified through OTP
    passwordHash,
    emergencyContacts: userData.emergencyContacts || []
  });
  
  // Generate tokens
  const tokens = tokenService.generateAuthTokens(user);
  
  // Return sanitized user data and tokens
  return {
    user: sanitizeUser(user),
    tokens
  };
};

/**
 * Login a user
 */
export const login = async (credentials: { email: string; password: string }) => {
  // Find the user by email
  const user = await User.findOne({ email: credentials.email.toLowerCase() });
  
  // Generic error message to prevent user enumeration
  const invalidCredentialsError = new ApiError(401, 'Invalid email or password');
  
  if (!user) {
    throw invalidCredentialsError;
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }
  
  // Generate tokens
  const tokens = tokenService.generateAuthTokens(user);
  
  // Return sanitized user data and tokens
  return {
    user: sanitizeUser(user),
    tokens
  };
};

/**
 * Sanitize user data for response
 */
const sanitizeUser = (user: IUser) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    createdAt: user.createdAt
  };
};