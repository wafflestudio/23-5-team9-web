import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import UserProfile from '@/features/user/components/UserProfile';
import CoinTab from '@/features/pay/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyPay } from '@/features/pay/hooks/useMyPay';
import { useAuth } from '@/shared/store/authStore';
import { Loading, Button, Avatar, DetailHeader } from '@/shared/ui';
import { PageContainer } from '@/shared/layouts/PageContainer';

import { useOnboarding } from '@/features/user/hooks/useUser';
import { useUser } from '@/features/user/hooks/useUser';
import { useRegionStore } from '@/shared/store/regionStore';
import { POLLING_CONFIG } from '@/shared/config/polling';
import { fetchRegionById } from '@/features/location/api/region';

type TabType = 'products' | 'profile' | 'coin' | 'password';

const MENU_ITEMS: { id: TabType; label: string; to: string }[] = [
  { id: 'products', label: '내 상품 관리', to: '/my/products' },
  { id: 'profile', label: '프로필 수정', to: '/my/profile' },
  { id: 'coin', label: '코인 관리', to: '/my/coin' },
  { id: 'password', label: '비밀번호 변경', to: '/my/password' },
];

interface MyCarrotProps {
  initialTab?: TabType;
}

function MyCarrot({ initialTab }: MyCarrotProps) {
  const { user } = useUser({ refetchInterval: POLLING_CONFIG.USER_BALANCE });
  const { depositCoin, withdrawCoin } = useMyPay();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const onboardingMutation = useOnboarding();
  const { setRegion } = useRegionStore();

  if (!user) return <Loading />;

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await onboardingMutation.mutateAsync(data);

      // 지역이 변경된 경우 regionStore도 업데이트
      if (data.region_id) {
        const region = await fetchRegionById(data.region_id);
        setRegion(region.id, `${region.sigugun} ${region.dong}`);
      }

      alert('정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  // First layer: Menu list
  if (!initialTab) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="text-2xl font-extrabold m-0">마이캐럿</h2>
          <Button onClick={() => { logout(); navigate('/products'); }} variant="outline" size="sm">로그아웃</Button>
        </div>

        {/* User info section - 코인관리 스타일 적용 */}
        <div className="rounded-lg bg-bg-page p-8 mb-6 flex flex-col items-center">
          <Avatar
            src={user.profile_image || undefined}
            alt={user.nickname || '사용자'}
            size="lg"
          />
          <div className="mt-4 text-center">
            <div className="text-xl font-bold text-text-heading">{user.nickname || '알 수 없음'}</div>
            <div className="text-sm text-text-secondary mt-1">{user.email}</div>
          </div>
        </div>

        {/* Menu list - 코인관리 버튼 스타일 적용 */}
        <div className="flex flex-col gap-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.to)}
              className="flex items-center justify-between w-full p-4 text-left border border-border-medium rounded-lg bg-bg-page hover:border-primary hover:text-primary transition-colors"
            >
              <span className="text-base font-medium text-text-heading">{item.label}</span>
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </PageContainer>
    );
  }

  // Second layer: Tab content with back button
  return (
    <PageContainer>
      <DetailHeader />
      <h2 className="text-2xl font-extrabold mb-6">
        {MENU_ITEMS.find(item => item.id === initialTab)?.label}
      </h2>

      <div className="content-area">
        {initialTab === 'products' && <UserProfile />}
        {initialTab === 'profile' && (
          <ProfileEditForm
            initialEmail={user.email}
            initialNickname={user.nickname || ''}
            initialRegionId={user.region?.id || ''}
            initialProfileImage={user.profile_image || ''}
            forceGPS={true}
            onSubmit={updateProfile}
          />
        )}
        {initialTab === 'coin' && <CoinTab user={user} onDeposit={depositCoin} onWithdraw={withdrawCoin} />}
        {initialTab === 'password' && <PasswordTab />}
      </div>
    </PageContainer>
  );
}

export default MyCarrot;