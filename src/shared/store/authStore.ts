import { create } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

interface AuthState {
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  login: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },
}));

// React Query 캐시 무효화가 필요한 경우 사용하는 훅
export function useAuth() {
  const queryClient = useQueryClient();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const login = (token: string, refreshToken: string) => {
    storeLogin(token, refreshToken);
    queryClient.invalidateQueries({ queryKey: userKeys.me() });
  };

  const logout = () => {
    storeLogout();
    // user 데이터를 null로 설정하여 즉시 로그아웃 상태 반영 (re-render 트리거)
    queryClient.setQueryData(userKeys.me(), null);
    // 모든 쿼리 제거 (이전 사용자 데이터가 남지 않도록)
    queryClient.removeQueries();
  };

  return { login, logout };
}
