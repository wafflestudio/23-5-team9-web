import client from '@/shared/api/client';

export interface User {
    id?: number;
    email: string;
    nickname: string | null;
    region: {
        id: string;
        name: string;
    } | null;
    profile_image: string | null;
    coin: number;
}

export interface UpdateUserParams {
    nickname: string;
    region_id: string;
    profile_image?: string;
    coin?: number;
}

export const userApi = {
    getMe: () => client.get<User>('/api/user/me'),
    
    updateOnboard: (data: UpdateUserParams) => client.post<User>('/api/user/me/onboard', data),
};
