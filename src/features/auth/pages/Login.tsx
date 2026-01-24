import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/shared/store/authStore';
import { userApi } from '@/features/user/api/user';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Input, PasswordInput, Button, GoogleIcon } from '@/shared/ui';
import { loginSchema, type LoginForm } from '../schemas';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const redirect = searchParams.get('redirect') || '/products';
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (form: LoginForm) => {
    setServerError('');
    try {
      const data = await authApi.login(form);
      login(data.access_token, data.refresh_token);

      const user = await userApi.getMe();
      const needsOnboarding = !user.nickname || !user.region;

      navigate(needsOnboarding
        ? `/auth/onboarding?redirect=${encodeURIComponent(redirect)}`
        : redirect
      );
    } catch (err: any) {
      const errData = err.response?.data;
      setServerError(
        errData?.detail ?? errData?.message ?? errData?.error ??
        (err.message ? '네트워크 오류가 발생했습니다.' : '이메일 또는 비밀번호가 올바르지 않습니다.')
      );
    }
  };

  return (
    <PageContainer>
      <div className="max-w-105 mx-auto w-full mt-10">
        <h2 className="mb-8 text-2xl font-bold text-text-primary">로그인</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="이메일"
            {...register('email')}
            error={errors.email?.message}
          />

          <PasswordInput
            placeholder="비밀번호"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={isSubmitting} variant="primary" fullWidth className="mt-4 text-lg">
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>

          {serverError && <div className="mt-3 text-center text-sm font-medium text-status-error">{serverError}</div>}
        </form>

        <Button
          onClick={() => window.location.href = authApi.getGoogleLoginUrl()}
          variant="outline" fullWidth
          className="mt-6 flex items-center justify-center gap-2 bg-bg-page"
        >
          <GoogleIcon /> Google로 계속하기
        </Button>

        <div className="mt-6 text-center text-sm text-text-secondary">
          아직 계정이 없으신가요?
          <Link to="/auth/signup" className="ml-1.5 font-semibold text-primary hover:underline">회원가입</Link>
        </div>
      </div>
    </PageContainer>
  );
}
