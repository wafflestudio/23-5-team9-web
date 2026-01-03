import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/user/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      onLogin && onLogin();
      navigate('/'); // 홈으로 이동
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-logo">당근마켓</h1>
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
        <div className="signup-link">
          아직 계정이 없으신가요? 
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
