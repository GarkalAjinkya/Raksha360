import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as OtpService from '../services/otp.service';
import * as AuthService from '../services/auth.service';
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

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password, verificationToken, emergencyContacts } = req.body;
  
  const result = await AuthService.register({
    name,
    email,
    phone,
    password,
    verificationToken,
    emergencyContacts
  });
  
  const responseData = {
    success: true,
    user: result.user,
    tokens: result.tokens
  };
  
  res.status(201).json(new ApiResponse(201, responseData, 'User registered successfully'));
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const result = await AuthService.login({ email, password });
  
  const responseData = {
    success: true,
    user: result.user,
    tokens: result.tokens
  };
  
  res.status(200).json(new ApiResponse(200, responseData, 'Login successful'));
});