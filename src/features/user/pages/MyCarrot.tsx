import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/pay/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyPay } from '@/features/pay/hooks/useMyPay';
import { useAuth } from '@/shared/store/authStore';
import { Loading, Button, TabBar } from '@/shared/ui';
import type { Tab } from '@/shared/ui';

import { useOnboarding } from '@/features/user/hooks/useUser';
import { useUser } from '@/features/user/hooks/useUser';

type TabType = 'profile' | 'coin' | 'password';

const TABS: Tab<TabType>[] = [
  { id: 'profile', label: '프로필 수정', to: '/my/profile' },
  { id: 'coin', label: '코인 관리', to: '/my/coin' },
  { id: 'password', label: '비밀번호 변경', to: '/my/password' },
];

interface MyCarrotProps {
  initialTab?: TabType;
}

function MyCarrot({ initialTab = 'profile' }: MyCarrotProps) {

  const { user } = useUser();
  if (!user) return <Loading />;

  const { depositCoin, withdrawCoin } = useMyPay(); 
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onboardingMutation = useOnboarding();
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

  return (
    <div className="max-w-[600px] px-5 py-10 mx-auto">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-2xl font-extrabold m-0">마이캐럿</h2>
        <Button onClick={() => { logout(); navigate('/products'); }} variant="outline" size="sm">로그아웃</Button>
      </div>

      <TabBar tabs={TABS} activeTab={initialTab} />

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