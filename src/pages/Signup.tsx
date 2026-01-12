import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import '../styles/login.css'; 

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
      const res = await authApi.signup({ email, password });

      if (res.ok) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const loginRes = await authApi.login({ email, password });
        
        if (loginRes.ok) {
            const data = await loginRes.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            
            if (onSignup) {
               onSignup();
            }
            
            navigate('/onboarding');
        } else {
             const errorText = await loginRes.text();
             console.error('Auto-login failed after signup:', errorText);
             navigate('/login');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.detail || '회원가입에 실패했습니다.');
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
        <h1 
            className="login-logo"
            onClick={() => navigate('/products')}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
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
            <div style={{ position: 'relative' }}>
                <input 
                    className="login-input" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="비밀번호 (8자 이상)" 
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
            
            <div style={{ position: 'relative' }}>
                <input 
                    className="login-input" 
                    type={showPasswordConfirm ? "text" : "password"} 
                    placeholder="비밀번호 확인" 
                    value={passwordConfirm} 
                    onChange={e => setPasswordConfirm(e.target.value)} 
                    required 
                    style={{ paddingRight: '50px' }} 
                />
                <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
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
                    {showPasswordConfirm ? '숨기기' : '보기'}
                </button>
            </div>

             {!passwordsMatch && passwordConfirm && (
                <div style={{color:'#ff4d4f', fontSize: '12px', marginLeft: '4px'}}>비밀번호가 일치하지 않습니다.</div>
            )}
            
            {error && <div className="login-error">{error}</div>}
            
            <button className="login-button" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? '가입 중...' : '다음'}
            </button>
        </form>

        <div className="signup-link">
          이미 계정이 있으신가요? 
          <Link to="/login" style={{ marginLeft: '5px' }}>로그인</Link>
        </div>
      </div>
    </div>
  );
}
