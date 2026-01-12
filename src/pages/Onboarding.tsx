import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user';
import ProfileEditForm from '../components/ProfileEditForm';
import '../styles/login.css';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [initialProfileImage, setInitialProfileImage] = useState('');

  useEffect(() => {
    const randomSeed = Math.random().toString(36).substring(7);
    setInitialProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
  }, []);

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
     setError('');
     const token = localStorage.getItem('token');
      if (!token) {
          navigate('/login');
          return;
      }

      const res = await userApi.updateOnboard(data);

      if (res.ok) {
        navigate('/community'); // Main page after onboarding
      } else {
        const errorData = await res.json();
        throw new Error(errorData.detail || '온보딩에 실패했습니다.');
      }
  };

  return (
    <div className="login-container">
      <div className="card form-card" style={{ width: '400px', margin: 'auto' }}>
        <h2 className="section-title">추가 정보 입력</h2>
        <p style={{marginBottom: '20px', color: '#666'}}>닉네임과 지역, 프로필 이미지를 설정해주세요.</p>
        
        {error && <div className="login-error" style={{marginBottom: '15px'}}>{error}</div>}

        <ProfileEditForm 
            initialProfileImage={initialProfileImage}
            submitButtonText="시작하기"
            onSubmit={async (data) => {
                try {
                    await handleOnboardingSubmit(data);
                } catch (e: any) {
                    setError(e.message);
                }
            }}
        />
      </div>
    </div>
  );
}
