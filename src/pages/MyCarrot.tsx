import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAIN_API_URL } from '../api/config';
import ProfileEditForm from '../components/ProfileEditForm';
import '../styles/common.css';

interface UserInfo {
  nickname: string;
  region: string; // Display name
  region_id: string; // ID for API
  profileImage: string;
  coin: number;
}


interface MyCarrotProps {
    onLogout: () => void;
}

function MyCarrot({ onLogout }: MyCarrotProps) {
  const [activeTab, setActiveTab] = useState('info'); // info, coin, password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  
  const [warningMessage, setWarningMessage] = useState('');

  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: '',
    region: '',
    region_id: '', 
    profileImage: 'https://via.placeholder.com/100',
    coin: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await fetch(`${MAIN_API_URL}/api/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUserInfo({
                    nickname: data.nickname || '',
                    region: data.region ? data.region.name : '지역 미설정',
                    region_id: data.region ? data.region.id : '',
                    profileImage: data.profile_image || 'https://via.placeholder.com/100',
                    coin: data.coin || 0
                });
            } else {
                console.error('Failed to fetch user info');
                // 토큰 만료 등의 경우 로그인 페이지로 리다이렉트 고려
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInfoUpdate = async (data: { nickname: string; region_id: string; profile_image: string }) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${MAIN_API_URL}/api/user/me/onboard/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nickname: data.nickname,
                region_id: data.region_id,
                profile_image: data.profile_image,
                coin: userInfo.coin // Keep existing coin
            })
        });

        if (res.ok) {
            // Update local state to reflect changes (optional, but good for UI consistency if we stayed on same view)
            // But we might need to refetch region name if region_id changed, or just let 'MyCarrot' reload.
            // For now, let's just update what we know.
             setUserInfo(prev => ({
                ...prev,
                nickname: data.nickname,
                region_id: data.region_id,
                profileImage: data.profile_image
            }));
            alert('정보가 수정되었습니다.');
        } else {
            alert('정보 수정 실패');
        }
    } catch (err) {
        console.error(err);
        alert('오류 발생');
    }
  };

  const handleCoinCharge = async (amount: number) => {
     try {
        const token = localStorage.getItem('token');
        const newCoin = userInfo.coin + amount;
        
        const res = await fetch(`${MAIN_API_URL}/api/user/me/onboard/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nickname: userInfo.nickname,
                region_id: userInfo.region_id || "78c24c9f-05ac-49b5-b3c7c3f66688",
                profile_image: userInfo.profileImage,
                coin: newCoin
            })
        });

        if (res.ok) {
            const data = await res.json();
            setUserInfo(prev => ({ ...prev, coin: data.coin }));
            alert(`${amount}코인이 충전되었습니다!`);
        } else {
            alert('충전 실패');
        }
    } catch (err) {
        console.error(err);
        alert('오류 발생');
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
      {warningMessage && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ffeeba',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {warningMessage}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>나의 당근</h2>
        <button 
            onClick={onLogout}
            style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#212529',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#ccedff'; // Optional hover effect
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#dee2e6';
            }}
        >
            로그아웃
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', borderBottom: '1px solid #e9ecef', paddingBottom: '0' }}>
        {['info', 'coin', 'password'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                    padding: '12px 20px', 
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === tab ? '2px solid #ff6f0f' : '2px solid transparent',
                    color: activeTab === tab ? '#212529' : '#868e96',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                }}
            >
                {tab === 'info' && '프로필 수정'}
                {tab === 'coin' && '코인 관리'}
                {tab === 'password' && '비밀번호 변경'}
            </button>
        ))}
      </div>

      <div className="content-area">
        {activeTab === 'info' && (
            <ProfileEditForm 
                initialNickname={userInfo.nickname}
                initialRegionId={userInfo.region_id}
                initialProfileImage={userInfo.profileImage}
                onSubmit={handleInfoUpdate}
            />
        )}


        {activeTab === 'coin' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ backgroundColor: '#fff4e6', padding: '40px', borderRadius: '16px', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#ff6f0f', marginBottom: '10px' }}>보유 코인</h3>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#212529' }}>
                {userInfo.coin.toLocaleString()} <span style={{ fontSize: '1.5rem', fontWeight: 'normal' }}>C</span>
                </div>
            </div>
            
            <h4 style={{ marginBottom: '20px', color: '#495057' }}>코인 충전하기</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[1000, 5000, 10000, 30000, 50000, 100000].map(amount => (
                    <button 
                        key={amount}
                        onClick={() => handleCoinCharge(amount)}
                        style={{
                            padding: '16px 0',
                            backgroundColor: '#fff',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#495057',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#ff6f0f';
                            e.currentTarget.style.color = '#ff6f0f';
                            e.currentTarget.style.backgroundColor = '#fff4e6';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#dee2e6';
                            e.currentTarget.style.color = '#495057';
                            e.currentTarget.style.backgroundColor = '#fff';
                        }}
                    >
                        +{amount.toLocaleString()}
                    </button>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>현재 비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input 
                    className="form-input"
                    type={showCurrentPassword ? "text" : "password"} 
                    style={{ paddingRight: '50px', marginBottom: 0 }} 
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showCurrentPassword ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>새 비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input 
                    className="form-input"
                    type={showNewPassword ? "text" : "password"} 
                    style={{ paddingRight: '50px', marginBottom: 0 }} 
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showNewPassword ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>새 비밀번호 확인</label>
              <div style={{ position: 'relative' }}>
                <input 
                    className="form-input"
                    type={showNewPasswordConfirm ? "text" : "password"} 
                    style={{ paddingRight: '50px', marginBottom: 0 }} 
                />
                <button
                    type="button"
                    onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#868e96',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    {showNewPasswordConfirm ? '숨기기' : '보기'}
                </button>
              </div>
            </div>
            <button type="submit" className="button" style={{ width: '100%', marginTop: '10px', height: '48px' }}>
                비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default MyCarrot;
