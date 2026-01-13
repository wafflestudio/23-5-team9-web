import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function SocialLoginHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, needsOnboarding } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // URL 정리
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Context의 login 함수 호출
      login(accessToken, refreshToken);
      
      // 리다이렉션 로직
      // (Context 상태 업데이트가 비동기라 약간의 딜레이가 있을 수 있으므로 
      //  login 함수 내부나 여기서 적절히 처리)
      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/products');
      }
    }
  }, [location, login, navigate, needsOnboarding]);

  return null; // 화면에 렌더링할 것은 없음
}
