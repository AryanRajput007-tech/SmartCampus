import { api } from './api';
import { ApiResponse, StudentProfile, Application } from '../types';

export const studentService = {
  async getProfile(): Promise<StudentProfile> {
    const res = await api.get<ApiResponse<StudentProfile>>('/students/profile');
    return res.data.data!;
  },

  async updateProfile(profileData: Partial<StudentProfile> & { name?: string }): Promise<StudentProfile> {
    const res = await api.put<ApiResponse<StudentProfile>>('/students/profile', profileData);
    return res.data.data!;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await api.get<ApiResponse<Application[]>>('/applications/my');
    return res.data.data || [];
  },

  async getApplicationById(id: string): Promise<Application> {
    const res = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    return res.data.data!;
  }
};
