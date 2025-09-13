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

export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .isMobilePhone('en-IN').withMessage('Invalid phone number format. Use E.164 format (e.g., +919876543210).'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
  body('verificationToken')
    .notEmpty().withMessage('Verification token is required.'),
  body('emergencyContacts')
    .optional()
    .isArray().withMessage('Emergency contacts must be an array.'),
  body('emergencyContacts.*.name')
    .notEmpty().withMessage('Emergency contact name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Emergency contact name must be between 2 and 50 characters.'),
  body('emergencyContacts.*.phone')
    .notEmpty().withMessage('Emergency contact phone is required.')
    .isMobilePhone('en-IN').withMessage('Invalid emergency contact phone format.'),
  body('emergencyContacts.*.relation')
    .notEmpty().withMessage('Emergency contact relation is required.'),
  handleValidationErrors
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  handleValidationErrors
];