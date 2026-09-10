import { api } from './api';
import { ApiResponse, Job, Application } from '../types';

export interface JobFilterParams {
  search?: string;
  location?: string;
  skills?: string;
  employmentType?: string;
  page?: number;
  limit?: number;
}

export const jobService = {
  async getJobs(params?: JobFilterParams): Promise<{ jobs: Job[]; count: number; totalPages: number }> {
    const res = await api.get<ApiResponse<Job[]>>('/jobs', { params });
    return {
      jobs: res.data.data || [],
      count: res.data.count || 0,
      totalPages: res.data.totalPages || 1
    };
  },

  async getJobById(id: string): Promise<Job> {
    const res = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data.data!;
  },

  async applyForJob(id: string): Promise<Application> {
    const res = await api.post<ApiResponse<Application>>(`/jobs/${id}/apply`);
    return res.data.data!;
  }
};
