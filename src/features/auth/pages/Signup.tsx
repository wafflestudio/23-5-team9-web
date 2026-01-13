import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/features/auth/context/AuthContext';
import PasswordInput from '@/shared/ui/PasswordInput';
// import '@/styles/login.css'; 

const AUTH_INPUT_STYLE = "w-full p-4 pr-[50px] text-base border-none rounded-xl bg-gray-100 text-slate-900 outline-none transition-all duration-200 focus:bg-gray-200 focus:ring-2 focus:ring-primary/10 placeholder:text-gray-400";
const TOGGLE_BTN_STYLE = "absolute right-[15px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 text-[13px] font-semibold";

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
      // Axios throws on non-2xx
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
    <div className="mx-auto mt-10 max-w-[420px] px-4">
      <h2 className="mb-8 text-2xl font-bold text-gray-800">회원가입</h2>
        
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
                className="w-full p-4 text-base border-none rounded-xl bg-gray-100 text-slate-900 outline-none transition-all duration-200 focus:bg-gray-200 focus:ring-2 focus:ring-primary/10 placeholder:text-gray-400" 
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
                className={AUTH_INPUT_STYLE}
                toggleButtonClassName={TOGGLE_BTN_STYLE}
            />
            
            <PasswordInput
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
                className={AUTH_INPUT_STYLE}
                toggleButtonClassName={TOGGLE_BTN_STYLE}
            />

             {!passwordsMatch && passwordConfirm && (
                <div className="text-[#ff4d4f] text-[12px] ml-1">비밀번호가 일치하지 않습니다.</div>
            )}
            
            {error && <div className="text-[#ff4d4f] text-sm mt-3 text-center font-medium">{error}</div>}
            
            <button 
                className="w-full p-4 text-[1.1rem] font-bold text-white bg-primary border-none rounded-xl cursor-pointer transition-all duration-200 mt-2.5 shadow-[0_4px_12px_rgba(255,111,15,0.2)] hover:bg-primary-hover hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(255,111,15,0.3)] disabled:bg-[#ffccaa] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" 
                type="submit" 
                disabled={loading}
            >
                {loading ? '가입 중...' : '다음'}
            </button>
        </form>

        <div className="mt-6 text-[0.95rem] text-gray-500">
          이미 계정이 있으신가요? 
          <Link to="/auth/login" className="text-primary font-semibold no-underline ml-1.5 hover:underline">로그인</Link>
        </div>
    </div>
  );
}
