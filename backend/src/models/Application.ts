import mongoose, { Schema } from 'mongoose';
import { IApplication } from '../types';

const applicationSchema = new Schema<IApplication>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: A student can apply to a specific job only once!
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
