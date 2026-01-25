import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mantine/core';
import { useTranslation } from '@/shared/i18n';

export function OnboardingRequired({ message }: { message?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const currentPath = location.pathname + location.search;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-bg-elevated flex items-center justify-center">
        <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <p className="text-text-muted mb-4">{message || t.auth.completeSettings}</p>
      <Button
        onClick={() => navigate(`/auth/onboarding?redirect=${encodeURIComponent(currentPath)}`)}
        size="sm"
        color="orange"
      >
        {t.auth.goToSettings}
      </Button>
    </div>
  );
}
