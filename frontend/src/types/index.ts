export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration?: string;
  description?: string;
}

export interface StudentProfile {
  _id?: string;
  userId?: string | User;
  phone: string;
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  preferredRoles: string[];
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EmploymentType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  location: string;
  employmentType: EmploymentType;
  salaryRange?: string;
  postedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  jobId: Job;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}

export interface MatchResult {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
  semantic_similarity?: number;
  skill_overlap_ratio?: number;
}

export interface ChatResult {
  response: string;
  source: 'gemini' | 'fallback';
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalJobs: number;
  totalApplications: number;
  selectedCount: number;
  statusOverview: {
    Applied: number;
    Shortlisted: number;
    Interview: number;
    Selected: number;
    Rejected: number;
  };
  recentApplications: Application[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  page?: number;
  totalPages?: number;
  error?: string;
}
