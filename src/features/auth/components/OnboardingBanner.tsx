import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/features/user/hooks/useUser';
import { Button } from '@/shared/ui';

export function OnboardingBanner() {
  const { user, needsOnboarding } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 온보딩 페이지와 채팅방에서는 배너 숨김
  const isChatRoom = location.pathname.startsWith('/chat/');
  const shouldShowBanner = user && needsOnboarding && location.pathname !== '/auth/onboarding' && !isChatRoom;

  if (!shouldShowBanner) return null;

  return (
    <div className="bg-primary text-white p-3 text-center flex justify-center gap-2.5 items-center text-sm font-medium animate-fade-in">
      <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다!</span>
      <Button
        onClick={() => navigate('/auth/onboarding')}
        variant="secondary"
        size="sm"
        className="text-xs"
      >
        설정하러 가기
      </Button>
    </div>
  );
}
