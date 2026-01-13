import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import '@/styles/login.css';
import { authApi } from '@/features/auth/api/auth';

interface LoginFormProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email, password });
      const data = res.data;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      onLogin && onLogin();
      navigate('/community'); // Main Login goes to Community default
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.detail || err.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleLoginUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-[420px] p-[50px_40px] bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-none flex flex-col items-center">
        <h1 
            className="text-[2.2rem] font-extrabold text-primary mb-2 -tracking-[1px] cursor-pointer"
            onClick={() => navigate('/products')}
        >
            당근마켓
        </h1>
        <h2 className="text-[1.2rem] text-gray-700 mb-[30px] font-semibold">로그인</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input 
            className="w-full p-4 text-base border-none rounded-xl bg-gray-100 text-dark outline-none transition-all duration-200 focus:bg-gray-200 focus:ring-2 focus:ring-primary/10 placeholder:text-gray-400" 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <div className="relative">
            <input 
              className="w-full p-4 pr-[50px] text-base border-none rounded-xl bg-gray-100 text-dark outline-none transition-all duration-200 focus:bg-gray-200 focus:ring-2 focus:ring-primary/10 placeholder:text-gray-400" 
              type={showPassword ? "text" : "password"} 
              placeholder="비밀번호" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[15px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-light text-[13px] font-semibold"
            >
                {showPassword ? '숨기기' : '보기'}
            </button>
          </div>
          <button 
            className="w-full p-4 text-[1.1rem] font-bold text-white bg-primary border-none rounded-xl cursor-pointer transition-all duration-200 mt-5 shadow-[0_4px_12px_rgba(255,111,15,0.2)] hover:bg-primary-hover hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(255,111,15,0.3)] disabled:bg-[#ffccaa] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" 
            type="submit" 
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          
          {error && <div className="text-[#ff4d4f] text-sm mt-3 text-center font-medium">{error}</div>}
        </form>

        <div className="w-full mt-2.5">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full p-[14px] mt-3 bg-white text-[#3c4043] border border-[#dadce0] rounded-xl text-base font-medium cursor-pointer transition-colors hover:bg-gray-50 hover:shadow-sm"
          >
            <svg className="mr-2.5" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g></svg>
            Google로 계속하기
          </button>
        </div>

        <div className="mt-6 text-[0.95rem] text-gray-light">
          아직 계정이 없으신가요? 
          <Link to="/signup" className="text-primary font-semibold no-underline ml-1.5 hover:underline">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
