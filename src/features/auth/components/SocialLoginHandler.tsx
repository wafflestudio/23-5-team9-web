import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { userApi } from '@/features/user/api/user';

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

      // 토큰 저장
      login(accessToken, refreshToken);

      // 유저 정보 조회하여 온보딩 필요 여부 확인 후 리다이렉션
      userApi.getMe().then(({ data: user }) => {
        const needsOnboarding = !user.nickname || !user.region;
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
