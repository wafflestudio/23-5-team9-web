import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../api/config';
import '../styles/login.css';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    consecutive: !/(.)\1{2,}/.test(password) && !/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/.test(password.toLowerCase()),
  };

  return (
    <div className="password-requirements" style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', marginBottom: '10px' }}>
      <div style={{ color: checks.length ? '#ff6f0f' : '#666' }}>{checks.length ? '✓' : '•'} 8자리 이상</div>
      <div style={{ color: checks.number ? '#ff6f0f' : '#666' }}>{checks.number ? '✓' : '•'} 숫자 포함</div>
      <div style={{ color: checks.case ? '#ff6f0f' : '#666' }}>{checks.case ? '✓' : '•'} 영문 대소문자 포함</div>
      <div style={{ color: checks.special ? '#ff6f0f' : '#666' }}>{checks.special ? '✓' : '•'} 특수문자 포함</div>
      <div style={{ color: checks.consecutive ? '#ff6f0f' : '#666' }}>{checks.consecutive ? '✓' : '•'} 연속된 문자열이나 숫자 없음</div>
    </div>
  );
};

interface SignupFormProps {
  onSignup?: () => void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password && password === passwordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        email,
        password,
      };

      const res = await fetch(`${BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await res.json(); // 응답 본문을 읽어서 요청을 확실히 완료
        
        // 서버의 데이터 처리를 기다리기 위해 잠시 대기 (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        // 회원가입 성공 후 자동 로그인 처리
        try {
          const loginRes = await fetch(`${BASE_URL}/api/auth/tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (loginRes.ok) {
            const loginData = await loginRes.json();
            localStorage.setItem('token', loginData.access_token);
            localStorage.setItem('refresh_token', loginData.refresh_token);
            
            if (onSignup) {
              onSignup();
            } else {
              navigate('/23-5-team9-web/products');
            }
          } else {
            // 자동 로그인 실패 시 조용히 로그인 페이지로 이동
            navigate('/23-5-team9-web/login');
          }
        } catch (loginErr) {
          console.error('Auto login failed:', loginErr);
          navigate('/23-5-team9-web/login');
        }
      } else {
        const errorData = await res.json();
        if (errorData.details) {
          const errorMessages = Object.values(errorData.details).join(' ');
          setError(errorMessages);
        } else {
          setError(errorData.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-logo">당근마켓</h1>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>회원가입</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="login-input" 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              required
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#666',
                fontSize: '0.8rem'
              }}
            >
              {showPassword ? '숨기기' : '보기'}
            </span>
          </div>

          {passwordFocused && <PasswordRequirements password={password} />}

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              className="login-input"
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              required
              style={{ borderColor: passwordConfirm && !passwordsMatch ? '#ff4d4f' : undefined }}
            />
            <span 
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#666',
                fontSize: '0.8rem'
              }}
            >
              {showPasswordConfirm ? '숨기기' : '보기'}
            </span>
          </div>
          
          {passwordConfirm && !passwordsMatch && (
            <div style={{ color: '#ff4d4f', fontSize: '0.8rem' }}>비밀번호가 일치하지 않습니다.</div>
          )}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </button>
          
          {error && <div className="login-error">{error}</div>}
        </form>

        <div className="signup-link">
          이미 계정이 있으신가요? <Link to="/23-5-team9-web/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
