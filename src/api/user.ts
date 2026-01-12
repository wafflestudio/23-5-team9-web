import fetchClient from './client';

export interface User {
    id?: number;
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
    profile_image: string;
    coin?: number;
}

export const userApi = {
    getMe: () => fetchClient('/api/user/me'),
    
    updateOnboard: (data: UpdateUserParams) => fetchClient('/api/user/me/onboard/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};
