import { Router } from 'express';
import { sendOtpController, verifyOtpController } from '../controllers/auth.controller';
import { sendOtpValidator, verifyOtpValidator } from '../validators/auth.validator';
import { sendOtpRateLimiter, verifyOtpRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.route('/send-otp').post(sendOtpRateLimiter, sendOtpValidator, sendOtpController);
router.route('/verify-otp').post(verifyOtpRateLimiter, verifyOtpValidator, verifyOtpController);

export default router;