import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/pay/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyPay } from '@/features/pay/hooks/useMyPay';
import { useAuth } from '@/shared/store/authStore';
import { Loading, Button, Avatar } from '@/shared/ui';

import { useOnboarding } from '@/features/user/hooks/useUser';
import { useUser } from '@/features/user/hooks/useUser';

type TabType = 'profile' | 'coin' | 'password';

const MENU_ITEMS: { id: TabType; label: string; to: string }[] = [
  { id: 'profile', label: '프로필 수정', to: '/my/profile' },
  { id: 'coin', label: '코인 관리', to: '/my/coin' },
  { id: 'password', label: '비밀번호 변경', to: '/my/password' },
];

interface MyCarrotProps {
  initialTab?: TabType;
}

function MyCarrot({ initialTab }: MyCarrotProps) {
  const { user } = useUser();
  const { depositCoin, withdrawCoin } = useMyPay();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const onboardingMutation = useOnboarding();

  if (!user) return <Loading />;

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await onboardingMutation.mutateAsync(data);
      alert('정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  // First layer: Menu list
  if (!initialTab) {
    return (
      <div className="max-w-[600px] px-5 py-10 mx-auto">
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="text-2xl font-extrabold m-0">마이캐럿</h2>
          <Button onClick={() => { logout(); navigate('/products'); }} variant="outline" size="sm">로그아웃</Button>
        </div>

        {/* User info section */}
        <div className="flex items-center gap-4 p-4 mb-6 bg-bg-secondary rounded-xl">
          <Avatar
            src={user.profile_image || undefined}
            alt={user.nickname || '사용자'}
            size="md"
          />
          <div>
            <div className="text-lg font-semibold text-text-heading">{user.nickname || '알 수 없음'}</div>
            <div className="text-sm text-text-secondary">{user.email}</div>
          </div>
        </div>

        {/* Menu list */}
        <div className="flex flex-col gap-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.to)}
              className="flex items-center justify-between w-full p-4 text-left bg-white border border-border-base rounded-xl hover:bg-bg-secondary transition-colors"
            >
              <span className="text-base font-medium text-text-heading">{item.label}</span>
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Second layer: Tab content with back button
  return (
    <div className="max-w-[600px] px-5 py-10 mx-auto">
      <div className="flex items-center gap-3 mb-[30px]">
        <button
          onClick={() => navigate('/my')}
          className="p-2 -ml-2 hover:bg-bg-secondary rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-text-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold m-0">
          {MENU_ITEMS.find(item => item.id === initialTab)?.label}
        </h2>
      </div>

      <div className="content-area">
        {initialTab === 'profile' && (
          <ProfileEditForm
            initialEmail={user.email}
            initialNickname={user.nickname || ''}
            initialRegionId={user.region?.id || ''}
            initialProfileImage={user.profile_image || ''}
            onSubmit={updateProfile}
          />
        )}
        {initialTab === 'coin' && <CoinTab user={user} onDeposit={depositCoin} onWithdraw={withdrawCoin} />}
        {initialTab === 'password' && <PasswordTab />}
      </div>
    </div>
  );
}

export default MyCarrot;