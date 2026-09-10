import { api } from './api';
import { ApiResponse, User } from '../types';

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'ADMIN';
    college?: string;
    degree?: string;
    graduationYear?: number;
    skills?: string[];
  }): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return res.data.data!;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    return res.data.data!;
  },

  async getMe(): Promise<{ user: User; profile?: any }> {
    const res = await api.get<ApiResponse<{ user: User; profile?: any }>>('/auth/me');
    return res.data.data!;
  }
};
