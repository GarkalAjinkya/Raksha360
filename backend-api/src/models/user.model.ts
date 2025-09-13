import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  passwordHash: string;
  emergencyContacts: IEmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
  },
  { _id: false } // no separate _id for embedded docs
);

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    phoneVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
    emergencyContacts: [EmergencyContactSchema],
  },
  { timestamps: true }
);

// ✅ Centralized indexes (scalable and clean)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema);
