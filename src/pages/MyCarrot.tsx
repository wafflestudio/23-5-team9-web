import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';

const BASE_URL = 'http://127.0.0.1:8000';

interface User {
  id: string;
  email: string;
  nickname: string | null;
  region: { id: string; name: string } | null;
  profile_image: string | null;
  coin: number;
  status: 'pending' | 'active';
}

function MyCarrot() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); // info, coin
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/23-5-team9-web/login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setNickname(data.nickname || '');
      } else {
        if (res.status === 401) {
           navigate('/23-5-team9-web/login');
        }
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      setError('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/user/me/onboard`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          nickname, 
          region_id: '7d47b451-5685-4d18-99cf-b426964a19db' // Valid region ID from seed
        })
      });
      if (res.ok) {
        alert('정보가 등록되었습니다.');
        fetchUserData();
      } else {
        const errorData = await res.json();
        alert(`정보 등록 실패: ${errorData.message || JSON.stringify(errorData)}`);
      }
    } catch (err) {
      alert('오류 발생: 서버와 통신 중 문제가 발생했습니다.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/user/me`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nickname })
      });
      if (res.ok) {
        alert('정보가 수정되었습니다.');
        fetchUserData();
      } else {
        alert('정보 수정 실패');
      }
    } catch (err) {
      alert('오류 발생');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>{error}</div>;

  return (
    <div className="page-padding">
      <h2>나의 당근</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('info')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'info' ? '#ff6f0f' : '#eee',
            color: activeTab === 'info' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          내 정보
        </button>
        <button 
          onClick={() => setActiveTab('coin')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'coin' ? '#ff6f0f' : '#eee',
            color: activeTab === 'coin' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          코인
        </button>
      </div>

      <div className="content-area" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
        {activeTab === 'info' && (
          <div>
            {user.status === 'pending' ? (
              <form onSubmit={handleOnboard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3>추가 정보 입력이 필요합니다 (Onboarding)</h3>
                <div>
                  <label>닉네임</label>
                  <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  />
                </div>
                <p style={{fontSize: '0.8rem', color: '#666'}}>* 지역은 자동으로 '서울특별시'로 설정됩니다 (테스트용)</p>
                <button type="submit" className="submit-btn" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>등록하기</button>
              </form>
            ) : (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3>프로필 정보</h3>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eee', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.profile_image ? <img src={user.profile_image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : 'No Image'}
                  </div>
                </div>
                <div>
                  <label>이메일</label>
                  <input type="text" value={user.email} disabled style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#f5f5f5' }} />
                </div>
                <div>
                  <label>닉네임</label>
                  <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>지역</label>
                  <input type="text" value={user.region?.name || '지역 없음'} disabled style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#f5f5f5' }} />
                </div>
                <button type="submit" className="submit-btn" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>수정하기</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'coin' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>보유 코인</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff6f0f', margin: 0 }}>
              {user.coin.toLocaleString()} <span style={{ fontSize: '20px', color: 'black' }}>코인</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCarrot;
