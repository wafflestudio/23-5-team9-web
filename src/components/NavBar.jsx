import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: '홈', path: '/React-Week5' },
    { id: 'chat', label: '채팅', path: '/React-Week5/chat' },
    { id: 'my', label: '나의 당근', path: '/React-Week5/my' },
  ];

  const isActive = (path) => {
    if (path === '/React-Week5' && (location.pathname === '/React-Week5' || location.pathname === '/React-Week5/')) return true;
    if (path !== '/React-Week5' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <h1 style={{ color: '#ff6f0f', marginBottom: '40px', textAlign: 'center' }}>당근마켓</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              padding: '15px 20px',
              fontSize: '1.1rem',
              textAlign: 'left',
              backgroundColor: isActive(item.path) ? '#ff6f0f' : 'transparent',
              color: isActive(item.path) ? 'white' : '#333',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: 'auto' }}>
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '1.1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              color: '#333',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => navigate('/React-Week5/login')}
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '1.1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              color: '#333',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
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
