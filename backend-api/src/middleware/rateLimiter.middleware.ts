import rateLimit from 'express-rate-limit';

// Rate limit for sending OTPs: 3 requests per hour from the same IP
export const sendOtpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many OTP requests from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for verifying OTPs: 5 requests per 10 minutes from the same IP
export const verifyOtpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: 'Too many verification attempts from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});