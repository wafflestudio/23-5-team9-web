import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import { useOnboarding } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const redirect = searchParams.get('redirect') || '/products';
  const onboardingMutation = useOnboarding();

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
     setError('');
     const token = localStorage.getItem('token');
      if (!token) {
          navigate('/auth/login');
          return;
      }

      try {
        await onboardingMutation.mutateAsync(data);
        navigate(redirect);
      } catch (err: any) {
        let detail = t.auth.onboardingFailed;
        if (err.response) {
          try {
            const errData = await err.response.json();
            detail = errData?.detail || t.auth.onboardingFailed;
          } catch { /* ignore */ }
        }
        throw new Error(detail);
      }
  };

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-4 text-2xl font-bold text-text-primary border-b-[3px] border-primary inline-block pb-2">{t.auth.additionalInfo}</h2>
      <p className="mb-5 text-text-secondary">{t.auth.onboardingDesc}</p>

      {error && <div className="text-status-error text-sm mb-3.75 text-center font-medium">{error}</div>}

      <ProfileEditForm
            initialProfileImage=""
            submitButtonText={t.auth.getStarted}
            forceGPS={true}
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
