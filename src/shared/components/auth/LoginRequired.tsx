import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mantine/core';
import { useTranslation } from '@/shared/i18n';

export function LoginRequired({ message }: { message?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const currentPath = location.pathname + location.search;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-bg-elevated flex items-center justify-center">
        <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <p className="text-text-muted mb-4">{message || t.auth.pleaseLogin}</p>
      <Button
        onClick={() => navigate(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)}
        size="sm"
        color="orange"
      >
        {t.auth.login}
      </Button>
    </div>
  );
}
