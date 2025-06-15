// src/config/db.ts
import mongoose, { Schema, model } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

const assessmentResultSchema = new Schema({
  userId: { type: String, required: true },
  domain: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  scores: { type: Schema.Types.Mixed, required: true } // Use Mixed for object
});

const AssessmentResult = mongoose.models.AssessmentResult || model('AssessmentResult', assessmentResultSchema);

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connected');
    }

    return {
      assessmentResults: AssessmentResult
    };
  } catch (err) {
    console.error('❌ DB connection error:', err);
    throw err;
  }
};
