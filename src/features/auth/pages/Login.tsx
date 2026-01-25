import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/features/auth/model';
import { userApi } from '@/features/user/api/user';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Input, PasswordInput, Button, GoogleIcon } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { loginSchema, type LoginForm } from '../schemas';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const t = useTranslation();
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
        (err.message ? t.auth.networkError : t.auth.invalidCredentials)
      );
    }
  };

  return (
    <PageContainer>
      <div className="max-w-105 mx-auto w-full mt-10">
        <h2 className="mb-8 text-2xl font-bold text-text-primary">{t.auth.login}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder={t.auth.email}
            {...register('email')}
            error={errors.email?.message}
          />

          <PasswordInput
            placeholder={t.auth.password}
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={isSubmitting} variant="primary" fullWidth className="mt-4 text-lg">
            {isSubmitting ? t.auth.loggingIn : t.auth.login}
          </Button>

          {serverError && <div className="mt-3 text-center text-sm font-medium text-status-error">{serverError}</div>}
        </form>

        <Button
          onClick={() => window.location.href = authApi.getGoogleLoginUrl()}
          variant="outline" fullWidth
          className="mt-6 flex items-center justify-center gap-2 bg-bg-page"
        >
          <GoogleIcon /> {t.auth.continueWithGoogle}
        </Button>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {t.auth.noAccount}
          <Link to="/auth/signup" className="ml-1.5 font-semibold text-primary hover:underline">{t.auth.signup}</Link>
        </div>
      </div>
    </PageContainer>
  );
}
