import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // 1. 미들웨어 불러오기
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

export const useAuthStore = create<AuthState>()(
  persist( // 2. persist 미들웨어로 감싸기
    (set) => ({
      // 초기값 설정 (자동으로 localStorage 데이터로 덮어씌워짐)
      token: null,
      refreshToken: null,
      isLoggedIn: false,

      // 3. 내부에서 localStorage.setItem 제거 (자동 저장됨)
      login: (token, refreshToken) => {
        set({ token, refreshToken, isLoggedIn: true });
      },

      // 4. 내부에서 localStorage.removeItem 제거 (자동 삭제/업데이트됨)
      logout: () => {
        set({ token: null, refreshToken: null, isLoggedIn: false });
      },

      updateTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },
    }),
    {
      name: 'auth-storage', // 5. localStorage에 저장될 Key 이름
      storage: createJSONStorage(() => localStorage), // (선택) 기본값이 localStorage라 생략 가능
    }
  )
);

// --- 아래부터는 기존 코드와 동일합니다 ---

// 인증 상태 selector (최적화된 구독)
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useToken = () => useAuthStore((state) => state.token);

// Effect 기반 React Query 캐시 동기화 훅
export function useAuthQuerySync() {
  const queryClient = useQueryClient();
  const isLoggedIn = useIsLoggedIn();
  const prevIsLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    if (prevIsLoggedIn.current !== isLoggedIn) {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: userKeys.me() });
      } else {
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