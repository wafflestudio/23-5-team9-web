import { useNavigate, useLocation } from 'react-router-dom';

interface NavBarProps {
  isLoggedIn: boolean;
  hasBanner?: boolean;
}

function NavBar({ isLoggedIn, hasBanner = false }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'products', label: '중고거래', path: '/dangeun/products' },
    { id: 'community', label: '동네생활', path: '/dangeun/community' },
    { id: 'map', label: '동네지도', path: '/dangeun/map' },
    { id: 'chat', label: '채팅하기', path: '/dangeun/chat' },
  ];

  const isActive = (path: string) => {
    if (location.pathname.startsWith(path)) return true;
    return false;
  };

  const buttonStyle = {
    padding: '8px 12px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#4d5159',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'color 0.2s'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    color: '#ff6f0f'
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
      top: hasBanner ? '50px' : '0',
      zIndex: 1000,
      transition: 'top 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <h1 
          onClick={() => navigate('/dangeun/products')}
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
              style={isActive(item.path) ? activeButtonStyle : buttonStyle}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
                onClick={() => navigate('/dangeun/my')}
                style={isActive('/dangeun/my') ? activeButtonStyle : buttonStyle}
            >
                나의 당근
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/dangeun/login')}
            style={isActive('/dangeun/login') ? activeButtonStyle : buttonStyle}
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
