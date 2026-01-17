import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/user/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyCarrotData } from '@/features/user/hooks/useMyCarrotData';
import { useAuth } from '@/shared/store/authStore';
import { Loading } from "@/shared/ui/StatusMessage";
import { Button } from '@/shared/ui/Button';
import { TabBar, Tab } from '@/shared/ui/TabBar';

function MyCarrot() {
  const { user, updateProfile, chargeCoin } = useMyCarrotData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  type TabType = 'info' | 'coin' | 'password';
  const [activeTab, setActiveTab] = useState<TabType>('info');

  if (!user) return <Loading />;

  const TABS: Tab<TabType>[] = [
    { id: 'info', label: '프로필 수정' },
    { id: 'coin', label: '코인 관리' },
    { id: 'password', label: '비밀번호 변경' },
  ];

  return (
    <div className="max-w-[600px] px-5 py-10 mx-auto">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-2xl font-extrabold m-0">마이캐럿</h2>
        <Button onClick={() => { logout(); navigate('/products'); }} variant="outline" size="sm">로그아웃</Button>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="content-area">
        {activeTab === 'info' && (
          <ProfileEditForm
            initialEmail={user.email}
            initialNickname={user.nickname || ''}
            initialRegionId={user.region?.id || ''}
            initialProfileImage={user.profile_image || ''}
            onSubmit={updateProfile}
          />
        )}
        {activeTab === 'coin' && <CoinTab user={user} onCharge={chargeCoin} />}
        {activeTab === 'password' && <PasswordTab />}
      </div>
    </div>
  );
}

export default MyCarrot;