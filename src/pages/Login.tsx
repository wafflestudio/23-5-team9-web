import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import { MAIN_API_URL } from '../api/config';

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
      const res = await fetch(`${MAIN_API_URL}/api/auth/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '로그인 실패');
      }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      onLogin && onLogin();
      navigate('/community'); // Main Login goes to Community default
    } catch (err: any) {
      console.error(err);
      setError(err.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${MAIN_API_URL}/api/auth/oauth2/login/google`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 
            className="login-logo"
            onClick={() => navigate('/products')}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
        >
            당근마켓
        </h1>
        <h2 className="login-title">로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="login-input" 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <div style={{ position: 'relative' }}>
            <input 
              className="login-input" 
              type={showPassword ? "text" : "password"} 
              placeholder="비밀번호" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ paddingRight: '50px' }}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#868e96',
                    fontSize: '13px',
                    fontWeight: '600'
                }}
            >
                {showPassword ? '숨기기' : '보기'}
            </button>
          </div>
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          
          {error && <div className="login-error">{error}</div>}
        </form>

        <div style={{ width: '100%', marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="google-login-btn"
          >
            <svg style={{ marginRight: '10px' }} width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g></svg>
            Google로 계속하기
          </button>
        </div>

        <div className="signup-link">
          아직 계정이 없으신가요? 
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
