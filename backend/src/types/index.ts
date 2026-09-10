import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'STUDENT' | 'ADMIN';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProject {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface IExperience {
  company: string;
  role: string;
  duration?: string;
  description?: string;
}

export interface IStudentProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  phone: string;
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  projects: IProject[];
  experience: IExperience[];
  preferredRoles: string[];
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EmploymentType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  location: string;
  employmentType: EmploymentType;
  salaryRange?: string;
  postedBy: Types.ObjectId | IUser;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId | IUser;
  jobId: Types.ObjectId | IJob;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  error?: string;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
