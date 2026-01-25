import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/features/user/hooks/useUser';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
}

// 초기화: localStorage에서 토큰을 읽어 Zustand store 초기화
const initialToken = localStorage.getItem('token');
const initialRefreshToken = localStorage.getItem('refresh_token');

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  refreshToken: initialRefreshToken,
  isLoggedIn: !!initialToken,

  login: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    set({ token: null, refreshToken: null, isLoggedIn: false });
  },

  // 토큰 갱신용 (client.ts의 interceptor에서 사용)
  updateTokens: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken });
  },
}));

// 인증 상태 selector (최적화된 구독)
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useToken = () => useAuthStore((state) => state.token);

// Effect 기반 React Query 캐시 동기화 훅
export function useAuthQuerySync() {
  const queryClient = useQueryClient();
  const isLoggedIn = useIsLoggedIn();
  const prevIsLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    // 로그인 상태가 변경되었을 때만 처리
    if (prevIsLoggedIn.current !== isLoggedIn) {
      if (isLoggedIn) {
        // 로그인: 사용자 데이터 새로고침
        queryClient.invalidateQueries({ queryKey: userKeys.me() });
      } else {
        // 로그아웃: 모든 쿼리 캐시 제거
        queryClient.removeQueries();
      }
      prevIsLoggedIn.current = isLoggedIn;
    }
  }, [isLoggedIn, queryClient]);
}

// 컴포넌트에서 사용하는 훅 (기존 API 호환)
export function useAuth() {
  const { login, logout } = useAuthStore();
  return { login, logout };
}
