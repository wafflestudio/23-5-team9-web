import React, { useState } from 'react';
import '../styles/common.css';

function MyCarrot() {
  const [activeTab, setActiveTab] = useState('info'); // info, coin, password
  const [userInfo, setUserInfo] = useState({
    nickname: '당근러',
    region: '서울시 강남구',
    profileImage: 'https://via.placeholder.com/100'
  });
  const [coin, setCoin] = useState(1000);

  const handleInfoUpdate = (e) => {
    e.preventDefault();
    alert('정보가 수정되었습니다.');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

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
          정보 수정
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
          코인 확인
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'password' ? '#ff6f0f' : '#eee',
            color: activeTab === 'password' ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          비밀번호 수정
        </button>
      </div>

      <div className="content-area" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
        {activeTab === 'info' && (
          <form onSubmit={handleInfoUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>프로필 정보 수정</h3>
            <div style={{ textAlign: 'center' }}>
              <img src={userInfo.profileImage} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }} />
              <br/>
              <button type="button" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>사진 변경</button>
            </div>
            <div>
              <label>닉네임</label>
              <input 
                type="text" 
                value={userInfo.nickname} 
                onChange={(e) => setUserInfo({...userInfo, nickname: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>지역</label>
              <input 
                type="text" 
                value={userInfo.region} 
                onChange={(e) => setUserInfo({...userInfo, region: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <button type="submit" className="submit-btn" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>저장하기</button>
          </form>
        )}

        {activeTab === 'coin' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3>나의 코인</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6f0f', margin: '20px 0' }}>
              {coin.toLocaleString()} C
            </div>
            <p>당근머니로 간편하게 거래해보세요!</p>
            <button style={{ marginTop: '20px', padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>충전하기</button>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>비밀번호 변경</h3>
            <div>
              <label>현재 비밀번호</label>
              <input type="password" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>새 비밀번호</label>
              <input type="password" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>새 비밀번호 확인</label>
              <input type="password" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <button type="submit" style={{ background: '#ff6f0f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>변경하기</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default MyCarrot;
