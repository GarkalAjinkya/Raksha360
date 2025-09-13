import { Router } from 'express';
import { sendOtpController, verifyOtpController, registerController, loginController } from '../controllers/auth.controller';
import { sendOtpValidator, verifyOtpValidator, registerValidator, loginValidator } from '../validators/auth.validator';
import { sendOtpRateLimiter, verifyOtpRateLimiter, loginRateLimiter, registerRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.route('/send-otp').post(sendOtpRateLimiter, sendOtpValidator, sendOtpController);
router.route('/verify-otp').post(verifyOtpRateLimiter, verifyOtpValidator, verifyOtpController);
router.route('/register').post(registerRateLimiter, registerValidator, registerController);
router.route('/login').post(loginRateLimiter, loginValidator, loginController);

export default router;