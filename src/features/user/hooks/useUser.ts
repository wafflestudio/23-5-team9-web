// 1. Import Libraries and APIs
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// useQuery          : GET
// useMutation       : POST, PUT, PATCH, DELETE
// useQueryClient

import { userApi, UpdateUserParams } from '@/features/user/api/user';
// userApi           : getMe(), updateOnboard()
// UpdateUserParams  : (for Onboarding)

// ===============================================

// 2. Query Key Factory
// userKeys.me() equals ['user', 'me']
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// ===============================================

// 3. useUser hook
export function useUser() {
  // (i) check if token is vaild
  const token = localStorage.getItem('token');
  
  // (ii) if valid, then fetch info
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: userKeys.me(), // ['user', 'me']
    queryFn: async () => {
      const { data } = await userApi.getMe();
      return data;
    },
    enabled: !!token,         // only when token exists 
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: false, 
  });

  const isLoggedIn = !!user;
  const needsOnboarding = !!user && (!user.nickname || !user.region);

  // (iii) provide user info to customers
  return {
    user: user ?? null,
    isLoading,
    isLoggedIn,
    needsOnboarding,
    error,
    refetch,
  };
}

// ===============================================

// 4. useUpdateUser hook
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
