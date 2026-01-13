import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { userApi, User } from '@/features/user/api/user';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  needsOnboarding: boolean;
  user: User | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // App.tsx의 상태들을 여기로 이동
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();

  // 기존 fetchUserData 로직 이동
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const res = await userApi.getMe();
      const data = res.data;
      setUser(data);
      setIsLoggedIn(true);
      setNeedsOnboarding(!data.nickname || !data.region);
    } catch (e: any) {
      console.error("Failed to fetch user data:", e);
      if (e.response?.status === 401) {
         // logout might be used before declaration if called synchronously, 
         // but via useEffect it should be fine. 
         // ideally logout should be hoisted or defined earlier.
         // For now, repeating logic to be safe or assuming it works as before.
         localStorage.removeItem('token');
         localStorage.removeItem('refresh_token');
         setIsLoggedIn(false);
         setNeedsOnboarding(false);
         setUser(null);
         navigate('/products');
      }
    }
  }, []);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setIsLoggedIn(true);
    checkAuth(); // 로그인 후 유저 정보 및 온보딩 여부 확인
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
    setUser(null);
    navigate('/products');
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
