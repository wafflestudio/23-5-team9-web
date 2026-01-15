import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { userApi, User } from '@/features/user/api/user';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  needsOnboarding: boolean;
  user: User | null;
  login: (token: string, refreshToken: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // App.tsx의 상태들을 여기로 이동
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
    setUser(null);
    navigate('/products');
  }, [navigate]);

  // 기존 fetchUserData 로직 이동
  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const { data } = await userApi.getMe();
      setUser(data);
      setIsLoggedIn(true);
      const needsOnboard = !data.nickname || !data.region;
      setNeedsOnboarding(needsOnboard);
      return needsOnboard;
    } catch (e: any) {
      console.error("Failed to fetch user data:", e);
      if (e.response?.status === 401) {
        logout();
      }
      return false;
    }
  }, [logout]);

  const login = async (token: string, refreshToken: string): Promise<boolean> => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setIsLoggedIn(true);
    return await checkAuth(); // 로그인 후 유저 정보 및 온보딩 여부 확인
  };

  // 초기 로드 시 인증 체크 (App.tsx의 useEffect 대체)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, needsOnboarding, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 편하게 쓰기 위한 커스텀 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
