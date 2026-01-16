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

// 다른 사용자 프로필 조회 응답 타입
export interface PublicUserProfile {
    id: string;
    nickname: string | null;
    profile_image: string | null;
}

export const userApi = {
    getMe: () => client.get<User>('/api/user/me'),

    onboardMe: (data: OnboardingParams) => client.post<User>('/api/user/me/onboard', data),

    patchMe: (data: PatchUserParams) => client.patch<User>('/api/user/me', data),

    getUser: (userId: string) => client.get<PublicUserProfile>(`/api/user/${userId}`),
};
