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
      navigate('/dangeun/community'); // Main Login goes to Community default
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
            onClick={() => navigate('/dangeun/products')}
            style={{ cursor: 'pointer' }}
        >
            당근마켓
        </h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="login-input" 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="login-input" 
            type="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          
          {error && <div className="login-error">{error}</div>}
        </form>

        <div style={{ width: '100%', marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="login-button"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #e0e0e0',
              fontWeight: 'normal'
            }}
          >
            Google로 계속하기
          </button>
        </div>

        <div className="signup-link">
          아직 계정이 없으신가요? 
          <Link to="/dangeun/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
