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
    return client.post('api/user/', { json: data }).json();
  },

  login: async (data: LoginRequest) => {
    return client.post('api/auth/tokens', { json: data }).json<LoginResponse>();
  },

  getGoogleLoginUrl: (): string => `${SOCIAL_LOGIN_API_URL}/api/auth/oauth2/login/google`,
};
