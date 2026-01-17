import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const Loading = () => (
  <div className="flex flex-col items-center justify-center py-10 w-full">
    <div className="w-8 h-8 border-4 border-border-base border-t-orange-500 rounded-full animate-spin mb-3"></div>
    <div className="text-text-secondary text-sm font-medium">로딩 중...</div>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => <div className="error">{message}</div>;

export const EmptyState = ({ message }: { message: string }) => (
  <div className="no-results">{message}</div>
);

export const LoginRequired = ({ message = "로그인하고 이용해주세요" }: { message?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-bg-elevated flex items-center justify-center">
        <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <p className="text-text-muted mb-4">{message}</p>
      <Button onClick={() => navigate('/auth/login')} size="sm">로그인</Button>
    </div>
  );
};

export const OnboardingRequired = ({ message = "닉네임과 지역 설정을 완료해주세요" }: { message?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-bg-elevated flex items-center justify-center">
        <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <p className="text-text-muted mb-4">{message}</p>
      <Button onClick={() => navigate('/auth/onboarding')} size="sm">설정하러 가기</Button>
    </div>
  );
};
