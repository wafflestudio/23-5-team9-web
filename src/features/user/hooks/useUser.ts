import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, OnboardingParams, PatchUserParams } from '@/features/user/api/user';
import { useToken, useAuthStore } from '@/shared/store/authStore';
import { isAuthError } from '@/shared/utils/authErrorHandler';

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  profile: (userId: string) => [...userKeys.all, 'profile', userId] as const,
};

interface UseUserOptions {
  refetchInterval?: number | false;
}

export function useUser(options: UseUserOptions = {}) {
  // Zustand store를 Single Source of Truth로 사용
  const token = useToken();
  const logout = useAuthStore((state) => state.logout);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      try {
        const { data } = await userApi.getMe();
        return data;
      } catch (err: any) {
        // 401 에러 시 로그아웃 처리 (AuthQuerySync가 캐시 정리)
        if (isAuthError(err)) {
          logout();
        }
        throw err;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
    refetchInterval: options.refetchInterval,
  });

  const isLoggedIn = !!user;
  const needsOnboarding = !!user && (!user.nickname || !user.region);

  return {
    user: user ?? null,
    isLoading,
    isLoggedIn,
    needsOnboarding,
    error,
    refetch,
  };
}

export function useOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingParams) => {
      const { data: result } = await userApi.onboardMe(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function usePatchUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatchUserParams) => {
      const { data: result } = await userApi.patchMe(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserProfile(userId: string | undefined) {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: userKeys.profile(userId || ''),
    queryFn: async () => {
      const { data } = await userApi.getUser(userId!);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return {
    profile: profile ?? null,
    isLoading,
    error,
  };
}
