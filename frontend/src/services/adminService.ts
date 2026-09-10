import { api } from './api';
import { ApiResponse, Job, Application, AdminDashboardStats, User } from '../types';

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats');
    return res.data.data!;
  },

  async getJobs(): Promise<Job[]> {
    const res = await api.get<ApiResponse<Job[]>>('/admin/jobs');
    return res.data.data || [];
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const res = await api.post<ApiResponse<Job>>('/admin/jobs', jobData);
    return res.data.data!;
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const res = await api.put<ApiResponse<Job>>(`/admin/jobs/${id}`, jobData);
    return res.data.data!;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/admin/jobs/${id}`);
  },

  async getStudents(): Promise<(User & { profile?: any })[]> {
    const res = await api.get<ApiResponse<(User & { profile?: any })[]>>('/admin/students');
    return res.data.data || [];
  },

  async getApplications(params?: { jobId?: string; status?: string }): Promise<Application[]> {
    const res = await api.get<ApiResponse<Application[]>>('/admin/applications', { params });
    return res.data.data || [];
  },

  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const res = await api.patch<ApiResponse<Application>>(`/admin/applications/${id}/status`, { status });
    return res.data.data!;
  }
};
