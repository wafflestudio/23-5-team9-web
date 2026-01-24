import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/shared/store/authStore';
import { Input, PasswordInput, Button } from '@/shared/ui';
import { signupSchema, type SignupForm } from '../schemas';

interface SignupPageProps {
  onSignup?: () => void;
}

export default function Signup({ onSignup }: SignupPageProps) {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (form: SignupForm) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    setServerError('');

    try {
      await authApi.signup({ email: form.email, password: form.password });
      await new Promise(resolve => setTimeout(resolve, 500));
      const loginRes = await authApi.login({ email: form.email, password: form.password });

      const data = loginRes.data;
      login(data.access_token, data.refresh_token);

      onSignup?.();
      navigate('/auth/onboarding');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error_msg || err.response?.data?.detail || '회원가입 중 오류가 발생했습니다.';
      setServerError(errorMsg);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-8 text-2xl font-bold text-text-primary">회원가입</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="이메일"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          placeholder="비밀번호 (8자 이상)"
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          placeholder="비밀번호 확인"
          {...register('passwordConfirm')}
          error={errors.passwordConfirm?.message}
        />

        {serverError && <div className="text-status-error text-sm mt-3 text-center font-medium">{serverError}</div>}

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          fullWidth
          className="mt-4"
        >
          {isSubmitting ? '가입 중...' : '다음'}
        </Button>
      </form>

      <div className="mt-6 text-[0.95rem] text-text-secondary">
        이미 계정이 있으신가요?
        <Link to="/auth/login" className="text-primary font-semibold no-underline ml-1.5 hover:underline">로그인</Link>
      </div>
    </div>
  );
}
