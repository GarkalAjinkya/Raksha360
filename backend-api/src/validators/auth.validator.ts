import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()[0].msg));
  }
  next();
};

export const sendOtpValidator = [
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .isMobilePhone('en-IN').withMessage('Invalid phone number format. Use E.164 format (e.g., +911234567890).'),
  body('purpose')
    .isIn(['signup', 'login', 'password_reset']).withMessage('Purpose must be one of: signup, login, password_reset.'),
  handleValidationErrors
];

export const verifyOtpValidator = [
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .isMobilePhone('en-IN').withMessage('Invalid phone number format.'),
  body('otp')
    .notEmpty().withMessage('OTP is required.')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
  body('otpId')
    .notEmpty().withMessage('OTP ID is required.')
    .isMongoId().withMessage('Invalid OTP ID.'),
  handleValidationErrors
];