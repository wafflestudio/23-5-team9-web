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
    <div className="bg-primary text-white p-3 text-center flex justify-center gap-2.5 items-center text-sm font-medium">
      <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다</span>
      <button 
        onClick={() => navigate('/onboarding')}
        className="bg-white text-primary border-none py-1 px-3 rounded cursor-pointer font-bold text-xs"
      >
        설정하러 가기
      </button>
    </div>
  );
}
