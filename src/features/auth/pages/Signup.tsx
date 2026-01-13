import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import '@/styles/login.css'; 

interface SignupFormProps {
  onSignup?: () => void;
}

export default function Signup({ onSignup }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      if (onSignup) {
          onSignup();
      }
      
      navigate('/onboarding');
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || '회원가입 중 오류가 발생했습니다.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 
            className="login-logo cursor-pointer mb-10"
            onClick={() => navigate('/products')}
        >
            당근마켓
        </h1>
        <h2 className="login-title">회원가입</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
            <input 
                className="login-input" 
                type="email" 
                placeholder="이메일" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
            />
            <div className="auth-input-container">
                <input 
                    className="login-input auth-password-input" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="비밀번호 (8자 이상)" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                >
                    {showPassword ? '숨기기' : '보기'}
                </button>
            </div>
            
            <div className="auth-input-container">
                <input 
                    className="login-input auth-password-input" 
                    type={showPasswordConfirm ? "text" : "password"} 
                    placeholder="비밀번호 확인" 
                    value={passwordConfirm} 
                    onChange={e => setPasswordConfirm(e.target.value)} 
                    required 
                />
                <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="auth-password-toggle"
                >
                    {showPasswordConfirm ? '숨기기' : '보기'}
                </button>
            </div>

             {!passwordsMatch && passwordConfirm && (
                <div className="error-text">비밀번호가 일치하지 않습니다.</div>
            )}
            
            {error && <div className="login-error">{error}</div>}
            
            <button className="login-button mt-10" type="submit" disabled={loading}>
                {loading ? '가입 중...' : '다음'}
            </button>
        </form>

        <div className="signup-link">
          이미 계정이 있으신가요? 
          <Link to="/login" className="signup-link-text">로그인</Link>
        </div>
      </div>
    </div>
  );
}
