import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/features/user/api/user';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
// import '@/styles/login.css';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
     setError('');
     const token = localStorage.getItem('token');
      if (!token) {
          navigate('/login');
          return;
      }

      try {
        await userApi.updateOnboard(data);
        navigate('/community'); // Main page after onboarding
      } catch (err: any) {
        const detail = err.response?.data?.detail || '온보딩에 실패했습니다.';
        throw new Error(detail);
      }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-none w-[400px] m-auto p-10">
        <h2 className="text-dark text-2xl font-bold mb-4 pb-2 border-b-[3px] border-primary inline-block">추가 정보 입력</h2>
        <p className="mb-5 text-[#666]">닉네임과 지역, 프로필 이미지를 설정해주세요.</p>
        
        {error && <div className="text-[#ff4d4f] text-sm mb-[15px] text-center font-medium">{error}</div>}

        <ProfileEditForm 
            initialProfileImage=""
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
