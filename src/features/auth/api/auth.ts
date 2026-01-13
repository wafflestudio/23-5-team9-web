// src/api/auth.ts
import client from '@/shared/api/client';
import { MAIN_API_URL } from '@/shared/api/config';

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
  signup: (data: SignupRequest) => {
    return client.post('/api/user/', data);
  },

  login: (data: LoginRequest) => {
    return client.post<LoginResponse>('/api/auth/tokens', data);
  },

  getGoogleLoginUrl: (): string => `${MAIN_API_URL}/api/auth/oauth2/login/google`,
};
