import mongoose, { Schema } from 'mongoose';
import { IJob } from '../types';

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill is needed'],
      index: true
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
      default: 'Full-time'
    },
    salaryRange: {
      type: String,
      trim: true,
      default: 'Not Disclosed'
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicationDeadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for title and company searches
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
