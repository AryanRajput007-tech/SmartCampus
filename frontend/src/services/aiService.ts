import { api } from './api';
import { ApiResponse, MatchResult, ChatResult } from '../types';

export const aiService = {
  async matchJob(data: {
    jobId?: string;
    skills?: string[];
    profileText?: string;
    requiredSkills?: string[];
    jobDescription?: string;
  }): Promise<MatchResult> {
    const res = await api.post<ApiResponse<MatchResult>>('/ai/match', data);
    return res.data.data!;
  },

  async chatWithAssistant(message: string, context?: string): Promise<ChatResult> {
    const res = await api.post<ApiResponse<ChatResult>>('/ai/chat', { message, context });
    return res.data.data!;
  }
};
