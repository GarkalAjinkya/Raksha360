import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as OtpService from '../services/otp.service';
import ApiResponse from '../utils/ApiResponse';

export const sendOtpController = asyncHandler(async (req: Request, res: Response) => {
  const { phone, purpose } = req.body;
  
  const result = await OtpService.sendOtp(phone, purpose);
  
  const responseData = {
      success: true,
      message: 'OTP sent successfully',
      otpId: result.otpId,
      expiresAt: result.expiresAt,
      retryAfter: result.retryAfter,
      ...(result.devOtp && { devOtp: result.devOtp }),
  };

  res.status(200).json(new ApiResponse(200, responseData));
});

export const verifyOtpController = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp, otpId } = req.body;
  
  const result = await OtpService.verifyOtp(phone, otp, otpId);
  
  const responseData = {
    success: true,
    message: 'OTP verified successfully',
    ...result,
  };
  
  res.status(200).json(new ApiResponse(200, responseData));
});