import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export function OnboardingBanner() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 유저 정보가 로드된 상태에서(user !== null), 닉네임이나 지역 정보가 없으면 온보딩 필요
  // isLoggedIn이 true여도 user가 아직 로드되지 않은 시점(null)에는 배너를 띄우지 않음 (깜빡임 방지)
  const isProfileIncomplete = user && (!user.nickname || !user.region);
  
  // 온보딩 페이지가 아닌 곳에서만 배너 노출
  const shouldShowBanner = isLoggedIn && isProfileIncomplete && location.pathname !== '/auth/onboarding';

  if (!shouldShowBanner) return null;

  return (
    <div className="bg-primary text-white p-3 text-center flex justify-center gap-2.5 items-center text-sm font-medium animate-fade-in">
      <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다!</span>
      <button
        onClick={() => navigate('/auth/onboarding')}
        className="bg-text-inverse text-primary border-none py-1 px-3 rounded cursor-pointer font-bold text-xs hover:bg-bg-box-light transition-colors"
      >
        설정하러 가기
      </button>
    </div>
  );
}
