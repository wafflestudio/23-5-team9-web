import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import { useUpdateUser } from '@/features/user/hooks/useUser';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
     setError('');
     const token = localStorage.getItem('token');
      if (!token) {
          navigate('/auth/login');
          return;
      }

      try {
        await updateUserMutation.mutateAsync(data);
        navigate('/community'); // Main page after onboarding
      } catch (err: any) {
        const detail = err.response?.data?.detail || '온보딩에 실패했습니다.';
        throw new Error(detail);
      }
  };

  return (
    <div className="mx-auto mt-10 max-w-[420px] px-4">
      <h2 className="mb-4 text-2xl font-bold text-text-primary border-b-[3px] border-primary inline-block pb-2">추가 정보 입력</h2>
      <p className="mb-5 text-text-secondary">닉네임과 지역, 프로필 이미지를 설정해주세요.</p>

      {error && <div className="text-status-error text-sm mb-[15px] text-center font-medium">{error}</div>}

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
  );
}
