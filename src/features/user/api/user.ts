import client from '@/shared/api/client';

export interface User {
  id?: number;
  email: string;
  nickname: string | null;
  region: {
    id: string;
    sido: string;
    sigugun: string;
    dong: string;
    full_name: string;
  } | null;
  profile_image: string | null;
  coin: number;
}

export interface OnboardingParams {
  nickname: string;
  region_id: string;
  profile_image?: string;
}

export interface PatchUserParams {
  nickname?: string;
  region_id?: string;
  profile_image?: string;
  coin?: number;
}

export interface PublicUserProfile {
  id: string;
  nickname: string | null;
  profile_image: string | null;
}

export const userApi = {
  getMe: async (): Promise<User> => {
    return client.get('/api/user/me').json<User>();
  },

  onboardMe: async (data: OnboardingParams): Promise<User> => {
    return client.post('/api/user/me/onboard', { json: data }).json<User>();
  },

  patchMe: async (data: PatchUserParams): Promise<User> => {
    return client.patch('/api/user/me', { json: data }).json<User>();
  },

  getUser: async (userId: string): Promise<PublicUserProfile> => {
    return client.get(`/api/user/${userId}`).json<PublicUserProfile>();
  },
};
