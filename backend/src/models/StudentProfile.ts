import mongoose, { Schema } from 'mongoose';
import { IStudentProfile } from '../types';

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    link: { type: String, trim: true }
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    description: { type: String }
  },
  { _id: false }
);

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    college: {
      type: String,
      trim: true,
      default: ''
    },
    degree: {
      type: String,
      trim: true,
      default: ''
    },
    graduationYear: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    skills: {
      type: [String],
      default: [],
      index: true
    },
    projects: {
      type: [projectSchema],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    preferredRoles: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', studentProfileSchema);
