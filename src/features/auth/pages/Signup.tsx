import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/shared/store/authStore';
import { Input, PasswordInput, Button } from '@/shared/ui';

interface SignupFormProps {
  onSignup?: () => void;
}

export default function Signup({ onSignup }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const passwordsMatch = password && password === passwordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    setLoading(true);
    setError('');

    try {
      await authApi.signup({ email, password });
      await new Promise(resolve => setTimeout(resolve, 500));
      const loginRes = await authApi.login({ email, password });

      const data = loginRes.data;
      login(data.access_token, data.refresh_token);

      if (onSignup) {
          onSignup();
      }

      navigate('/auth/onboarding');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error_msg || err.response?.data?.detail || '회원가입 중 오류가 발생했습니다.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-8 text-2xl font-bold text-text-primary">회원가입</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
          error={!passwordsMatch && passwordConfirm ? '비밀번호가 일치하지 않습니다.' : undefined}
        />

        {error && <div className="text-status-error text-sm mt-3 text-center font-medium">{error}</div>}

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          fullWidth
          className="mt-4"
        >
          {loading ? '가입 중...' : '다음'}
        </Button>
      </form>

      <div className="mt-6 text-[0.95rem] text-text-secondary">
        이미 계정이 있으신가요?
        <Link to="/auth/login" className="text-primary font-semibold no-underline ml-1.5 hover:underline">로그인</Link>
      </div>
    </div>
  );
}
