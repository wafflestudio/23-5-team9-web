// src/api/auth.ts
import client from '@/shared/api/client';
import { SOCIAL_LOGIN_API_URL } from '@/features/auth/api/config';

export interface SignupRequest {
  email: string; 
  password: string;
  nickname?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  signup: async (data: SignupRequest) => {
    const response = await client.post('/api/user/', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await client.post<LoginResponse>('/api/auth/tokens', data);
    return response.data;
  },

  getGoogleLoginUrl: (): string => `${SOCIAL_LOGIN_API_URL}/api/auth/oauth2/login/google`,
};
