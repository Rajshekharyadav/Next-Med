import mongoose, { Schema, Document } from 'mongoose';

export interface IDiagnosis extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  symptoms: string[];
  additionalInfo: string;
  aiPrediction: {
    possibleConditions: Array<{
      name: string;
      probability: number;
      description: string;
    }>;
    recommendedActions: string[];
    disclaimer: string;
  };
  createdAt: Date;
}

const DiagnosisSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    type: [String],
    required: true
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  aiPrediction: {
    possibleConditions: [{
      name: { type: String, required: true },
      probability: { type: Number, required: true },
      description: { type: String, required: true }
    }],
    recommendedActions: [String],
    disclaimer: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Diagnosis || mongoose.model<IDiagnosis>('Diagnosis', DiagnosisSchema); 