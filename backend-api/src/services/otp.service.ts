import { Otp, IOtp } from '../models/otp.model';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import logger from '../config/logger';

const OTP_EXPIRY_MINUTES = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const RETRY_COOLDOWN_SECONDS = 60;

/**
 * Generate a random 6-digit numeric OTP
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Service to send an OTP to a user's phone
 */
export const sendOtp = async (phone: string, purpose: IOtp['purpose']) => {
  // 1. Check if an active OTP request exists with a cooldown
  const lastOtpRequest = await Otp.findOne({ phone, purpose }).sort({ createdAt: -1 });
  
  if (lastOtpRequest) {
    const timeSinceLastOtp = (Date.now() - lastOtpRequest.get('createdAt').getTime()) / 1000;
    if (timeSinceLastOtp < RETRY_COOLDOWN_SECONDS) {
      const timeLeft = Math.ceil(RETRY_COOLDOWN_SECONDS - timeSinceLastOtp);
      throw new ApiError(429, `Please wait ${timeLeft} seconds before requesting a new OTP.`);
    }
  }

  // 2. Generate OTP and metadata
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, env.BCRYPT_SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // 3. Store OTP in database
  const otpEntry = await Otp.create({
    phone,
    purpose,
    otpHash,
    expiresAt,
  });

  // 4. Send SMS (with development fallback)
  let devOtp: string | undefined;

  if (env.NODE_ENV === 'development' && !env.MSG91_API_KEY) {
    devOtp = otp;
    logger.info(`DEV OTP for ${phone}: ${otp}`);
  } else {
    // TODO: Integrate with a real SMS provider like MSG91/Twilio
    // await sendSms(phone, `Your verification code is: ${otp}`);
    logger.info(`(Pretend) SMS sent to ${phone}`);
  }

  return {
    otpId: otpEntry._id,
    expiresAt: otpEntry.expiresAt,
    retryAfter: RETRY_COOLDOWN_SECONDS,
    devOtp,
  };
};

/**
 * Service to verify an OTP
 */
export const verifyOtp = async (phone: string, otp: string, otpId: string) => {
  // 1. Find the OTP request
  const otpRequest = await Otp.findById(otpId);

  if (!otpRequest || otpRequest.phone !== phone) {
    throw new ApiError(404, 'OTP not found or does not match the phone number.');
  }

  // 2. Check status and expiry
  if (otpRequest.status !== 'pending') {
    throw new ApiError(410, 'This OTP has already been used or invalidated.');
  }
  if (new Date() > otpRequest.expiresAt) {
    otpRequest.status = 'expired';
    await otpRequest.save();
    throw new ApiError(401, 'OTP has expired.');
  }

  // 3. Check attempts
  if (otpRequest.attempts >= MAX_VERIFY_ATTEMPTS) {
    throw new ApiError(429, 'Too many verification attempts. Please request a new OTP.');
  }

  // 4. Compare OTP
  const isMatch = await bcrypt.compare(otp, otpRequest.otpHash);

  if (!isMatch) {
    otpRequest.attempts += 1;
    await otpRequest.save();
    throw new ApiError(401, 'Incorrect OTP.');
  }

  // 5. On success, invalidate OTP and create verification token
  otpRequest.status = 'verified';
  await otpRequest.save();

  const verificationToken = jwt.sign(
    { phone, otpId },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: env.JWT_EXPIRY as string }
  );
  
  const decodedToken = jwt.decode(verificationToken) as { exp: number };

  return {
    verified: true,
    verificationToken,
    expiresAt: new Date(decodedToken.exp * 1000),
  };
};