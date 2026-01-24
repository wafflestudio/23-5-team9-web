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
        const response = await client.get<User>('/api/user/me');
        return response.data;
    },

    onboardMe: async (data: OnboardingParams): Promise<User> => {
        const response = await client.post<User>('/api/user/me/onboard', data);
        return response.data;
    },

    patchMe: async (data: PatchUserParams): Promise<User> => {
        const response = await client.patch<User>('/api/user/me', data);
        return response.data;
    },

    getUser: async (userId: string): Promise<PublicUserProfile> => {
        const response = await client.get<PublicUserProfile>(`/api/user/${userId}`);
        return response.data;
    },
};
