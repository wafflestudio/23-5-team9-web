import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { userApi, User } from '../api/user';
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
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
        setNeedsOnboarding(!data.nickname || !data.region);
      } else if (res.status === 401) {
        logout(); // 401 시 자동 로그아웃 처리
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
      // 에러 시 보수적으로 로그아웃 처리할지, 유지할지 결정 필요. 일단 유지.
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
