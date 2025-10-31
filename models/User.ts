import { ObjectId } from 'mongodb';
import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  medicalHistory?: {
    conditions?: string[];
    allergies?: string[];
    medications?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  medicalHistory?: {
    conditions?: string[];
    allergies?: string[];
    medications?: string[];
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'user', enum: ['user', 'doctor', 'admin'] },
  phone: String,
  dateOfBirth: String,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  medicalHistory: {
    conditions: [String],
    allergies: [String],
    medications: [String]
  }
}, {
  timestamps: true
});

// Create and export the User model
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);