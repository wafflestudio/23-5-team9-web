import { useState } from 'react';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/user/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyCarrotData } from '@/features/user/hooks/useMyCarrotData';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Loading } from "@/shared/ui/StatusMessage";
import { Button } from '@/shared/ui/Button';

function MyCarrot() {
  const { user, updateProfile, chargeCoin } = useMyCarrotData();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) return <Loading />;

  const TABS = [
    { id: 'info', label: '프로필 수정' },
    { id: 'coin', label: '코인 관리' },
    { id: 'password', label: '비밀번호 변경' },
  ];

  return (
    <div className="max-w-[600px] px-5 py-10 mx-auto">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-2xl font-extrabold m-0">마이캐럿</h2>
        <Button onClick={logout} variant="outline" size="sm">로그아웃</Button>
      </div>

      <div className="flex gap-2 mb-[30px] border-b border-border-base pb-0">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            className={`
              border-b-2 rounded-none
              ${activeTab === tab.id
                ? 'border-primary text-text-heading font-bold'
                : 'border-transparent text-text-secondary font-normal hover:text-text-heading'
              }
            `}
          >
            {tab.label}
          </Button>
        ))}
      </div>

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