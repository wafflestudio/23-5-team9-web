import fetchClient from './client';

const BACKEND_URL = 'https://dev.server.team9-toy-project.p-e.kr';

export interface SignupRequest {
  email: string; 
  password: string;
  nickname?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = {
  signup: (data: SignupRequest): Promise<Response> => {
    return fetchClient('/api/user/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: (data: LoginRequest): Promise<Response> => {
    return fetchClient('/api/auth/tokens', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getGoogleLoginUrl: (): string => `${BACKEND_URL}/api/auth/oauth2/login/google`,
};