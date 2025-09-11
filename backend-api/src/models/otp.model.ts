import mongoose, { Schema, Document } from 'mongoose';

export type OtpPurpose = 'signup' | 'login' | 'password_reset';
export type OtpStatus = 'pending' | 'verified' | 'expired';

export interface IOtp extends Document {
  phone: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  attempts: number;
  status: OtpStatus;
}

const OtpSchema: Schema = new Schema({
  phone: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'login', 'password_reset'], required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'verified', 'expired'], default: 'pending' },
}, { timestamps: true });

// TTL index to automatically delete documents after 5 minutes
// The `expireAfterSeconds: 0` means documents are deleted when `expiresAt` time is reached.
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>('Otp', OtpSchema);