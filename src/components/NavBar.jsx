import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: '중고거래', path: '/' },
    { id: 'chat', label: '채팅하기', path: '/chat' },
    { id: 'my', label: '나의 당근', path: '/my' },
  ];

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/')) return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav style={{
      width: '100%',
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <h1 
          onClick={() => navigate('/')}
          style={{ 
            color: '#ff6f0f', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            margin: 0 
          }}
        >
          당근마켓
        </h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                backgroundColor: 'transparent',
                color: isActive(item.path) ? '#ff6f0f' : '#4d5159',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'color 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#e9ecef',
              color: '#212529',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#ff6f0f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
