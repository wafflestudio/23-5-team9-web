import { useState } from 'react';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import CoinTab from '@/features/user/components/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import { useMyCarrotData } from '@/features/user/hooks/useMyCarrotData';
import { Loading } from "@/shared/ui/StatusMessage";
import '@/styles/common.css';
import '@/styles/my-carrot.css';

function MyCarrot({ onLogout }: { onLogout: () => void }) {
  const { user, updateProfile, chargeCoin } = useMyCarrotData();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) return <Loading />;

  const TABS = [
    { id: 'info', label: '프로필 수정' },
    { id: 'coin', label: '코인 관리' },
    { id: 'password', label: '비밀번호 변경' },
  ];

  return (
    <div className="my-carrot-container">
      <div className="header">
        <h2 className="header-title">나의 당근</h2>
        <button onClick={onLogout} className="logout-button">로그아웃</button>
      </div>
      
      <div className="tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
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