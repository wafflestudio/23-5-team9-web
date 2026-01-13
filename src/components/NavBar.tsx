import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

interface NavBarProps {
  isLoggedIn: boolean;
}

function NavBar({ isLoggedIn }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'products', label: '중고거래', path: '/products' },
    { id: 'community', label: '동네생활', path: '/community' },
    { id: 'map', label: '동네지도', path: '/map' },
    { id: 'chat', label: '채팅하기', path: '/chat' },
  ];

  const isActive = (path: string) => {
    if (location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-left">
          <h1 
            onClick={() => navigate('/products')}
            className="navbar-logo"
          >
            당근마켓
          </h1>
          <div className="navbar-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Main nav items followed directly by auth actions */}
            {isLoggedIn ? (
              <button
                  onClick={() => navigate('/my')}
                  className={`navbar-item ${isActive('/my') ? 'active' : ''}`}
              >
                  나의 당근
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`navbar-item ${isActive('/login') ? 'active' : ''}`}
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="메뉴 열기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
      </nav>

      {/* Mobile Side Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
                <div className="mobile-menu-title">당근마켓</div>
                <button className="mobile-menu-close" onClick={toggleMenu} aria-label="메뉴 닫기">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div className="mobile-menu-list">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`mobile-menu-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        {item.label}
                    </button>
                ))}
                
                <hr style={{ margin: '10px 20px', border: 'none', borderTop: '1px solid #eee' }} />
                
                {isLoggedIn ? (
                    <button
                        onClick={() => handleNavigation('/my')}
                        className={`mobile-menu-item ${isActive('/my') ? 'active' : ''}`}
                    >
                        나의 당근
                    </button>
                ) : (
                    <button
                        onClick={() => handleNavigation('/login')}
                        className={`mobile-menu-item ${isActive('/login') ? 'active' : ''}`}
                    >
                        로그인
                    </button>
                )}
            </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
