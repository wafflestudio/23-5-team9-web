import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export function OnboardingBanner() {
  const { isLoggedIn, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 기존 App.tsx에 있던 배너 노출 로직
  // Onboarding 페이지에서는 배너를 보여주지 않음
  const shouldShowBanner = isLoggedIn && needsOnboarding && location.pathname !== '/onboarding';

  if (!shouldShowBanner) return null;

  return (
    <div className="onboarding-banner">
      <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다</span>
      <button 
        onClick={() => navigate('/onboarding')}
        className="onboarding-banner-button"
      >
        설정하러 가기
      </button>
    </div>
  );
}
