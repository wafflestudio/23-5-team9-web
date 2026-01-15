import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, UpdateUserParams } from '@/features/user/api/user';

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
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

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserParams) => {
      const { data: result } = await userApi.updateOnboard(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}
