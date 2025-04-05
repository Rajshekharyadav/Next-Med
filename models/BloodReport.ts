import mongoose, { Schema, Document } from 'mongoose';

export interface BloodTestValue {
  name: string;
  value: string;
  referenceRange: string;
  interpretation?: string;
  severity?: string;
  recommendation?: string;
}

export interface IBloodReport extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  reportDate: Date;
  uploadDate: Date;
  fileName: string;
  fileUrl?: string;
  abnormalValues: BloodTestValue[];
  normalValues: BloodTestValue[];
  healthInsights: string[];
  nutritionAdvice: string[];
  lifestyleRecommendations: string[];
}

const BloodTestValueSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  referenceRange: { type: String, required: true },
  interpretation: { type: String },
  severity: { type: String },
  recommendation: { type: String }
});

const BloodReportSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  abnormalValues: [BloodTestValueSchema],
  normalValues: [BloodTestValueSchema],
  healthInsights: [String],
  nutritionAdvice: [String],
  lifestyleRecommendations: [String]
});

export default mongoose.models.BloodReport || mongoose.model<IBloodReport>('BloodReport', BloodReportSchema); 