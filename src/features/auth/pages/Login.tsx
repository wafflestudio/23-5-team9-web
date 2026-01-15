import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/features/auth/context/AuthContext';
import PasswordInput from '@/shared/ui/PasswordInput';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { GoogleIcon } from '@/shared/ui/Icons';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login(form);
      const needsOnboarding = await login(data.access_token, data.refresh_token);
      if (needsOnboarding) {
        navigate('/auth/onboarding');
      } else {
        navigate('/products');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-[420px] mx-auto w-full mt-10">
        <h2 className="mb-8 text-2xl font-bold text-text-primary">로그인</h2>
          
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input 
            name="email" type="email" placeholder="이메일" required
            value={form.email} onChange={handleChange} 
          />
          <PasswordInput
            name="password"
            placeholder="비밀번호"
            required
            value={form.password}
            onChange={handleChange}
          />
          
          <Button 
            type="submit" 
            disabled={loading}
            variant="primary"
            fullWidth
            className="mt-4 text-lg"
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
          
          {error && <div className="mt-3 text-center text-sm font-medium text-status-error">{error}</div>}
        </form>

        <Button 
          onClick={() => window.location.href = authApi.getGoogleLoginUrl()}
          variant="outline"
          fullWidth
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