import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export function SocialLoginHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // URL 정리
      window.history.replaceState({}, document.title, window.location.pathname);

      // Context의 login 함수 호출 후 온보딩 여부에 따라 리다이렉션
      login(accessToken, refreshToken).then((needsOnboarding) => {
        if (needsOnboarding) {
          navigate('/auth/onboarding');
        } else {
          navigate('/products');
        }
      });
    }
  }, [location, login, navigate]);

  return null; // 화면에 렌더링할 것은 없음
}
