import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/features/auth/context/AuthContext';
import PasswordInput from '@/shared/ui/PasswordInput';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

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
      login(data.access_token, data.refresh_token);
      navigate('/community');
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

// 복잡한 SVG는 하단으로 분리
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);
