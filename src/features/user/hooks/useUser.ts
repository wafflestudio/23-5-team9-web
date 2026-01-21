import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, OnboardingParams, PatchUserParams } from '@/features/user/api/user';

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  profile: (userId: string) => [...userKeys.all, 'profile', userId] as const,
};

export function useUser() {
  const token = localStorage.getItem('token');

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const { data } = await userApi.getMe();
      return data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
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
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function resetMe() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: userKeys.me() });
}

export function usePatchUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatchUserParams) => {
      const { data: result } = await userApi.patchMe(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
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
