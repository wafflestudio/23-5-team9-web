import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import { useOnboarding, useUser } from '@/features/user/hooks/useUser';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/products';

  // useUser를 통해 현재 로그인 상태를 가져옵니다.
  const { isLoggedIn, isLoading } = useUser();
  const onboardingMutation = useOnboarding();

  // [수정] 토큰 직접 확인 대신, 인증 상태에 따른 리다이렉트 로직을 useEffect로 분리
  useEffect(() => {
    // 로딩 중이 아닌데 로그인되어 있지 않다면 로그인 페이지로 이동
    if (!isLoading && !isLoggedIn) {
      navigate('/auth/login', { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
    setError('');

    try {
      // API 클라이언트(axios 등)에서 이미 인터셉터를 통해 토큰을 처리하고 있으므로
      // 여기서 별도로 토큰을 꺼내 확인할 필요가 없습니다.
      await onboardingMutation.mutateAsync(data);
      navigate(redirect);
    } catch (err: any) {
      const detail = err.response?.data?.detail || '온보딩에 실패했습니다.';
      // 에러 메시지를 상태에 저장하여 UI에 표시합니다.
      setError(detail);
      throw new Error(detail); // ProfileEditForm 내부의 catch 문에서 처리될 수 있도록 던져줍니다.
    }
  };

  // 인증 상태 확인 중일 때는 로딩 화면을 보여주어 폼이 깜빡이는 것을 방지합니다.
  if (isLoading) {
    return <div className="text-center mt-20">사용자 확인 중...</div>;
  }

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-4 text-2xl font-bold text-text-primary border-b-[3px] border-primary inline-block pb-2">
        추가 정보 입력
      </h2>
      <p className="mb-5 text-text-secondary">닉네임과 지역, 프로필 이미지를 설정해주세요.</p>

      {error && (
        <div className="text-status-error text-sm mb-3.75 text-center font-medium">
          {error}
        </div>
      )}

      <ProfileEditForm
        initialProfileImage=""
        submitButtonText="시작하기"
        forceGPS={true}
        onSubmit={handleOnboardingSubmit}
      />
    </div>
  );
}