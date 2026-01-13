import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

interface NavBarProps {
  isLoggedIn: boolean;
}

const NAV_ITEMS = [
  { id: 'products', label: '중고거래', path: '/products' },
  { id: 'community', label: '동네생활', path: '/community' },
  { id: 'map', label: '동네지도', path: '/map' },
  { id: 'chat', label: '채팅하기', path: '/chat' },
];

/**
 * 네비게이션 버튼 컴포넌트
 */
interface NavButtonProps {
  label: string;
  path: string;
  isActive: boolean;
  onClick: (path: string) => void;
  className?: string;
}

const NavButton = ({ label, path, isActive, onClick, className = 'navbar-item' }: NavButtonProps) => (
  <button
    onClick={() => onClick(path)}
    className={`${className} ${isActive ? 'active' : ''}`}
  >
    {label}
  </button>
);

/**
 * 아이콘 컴포넌트들
 */
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function NavBar({ isLoggedIn }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 현재 경로가 해당 path로 시작하는지 확인
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // 모바일 메뉴 닫기
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // 로그인 상태에 따른 버튼 렌더링
  const renderAuthButton = (isMobile = false) => {
    const className = isMobile ? 'mobile-menu-item' : 'navbar-item';
    const label = isLoggedIn ? '나의 당근' : '로그인';
    const path = isLoggedIn ? '/my' : '/login';

    return (
      <NavButton
        label={label}
        path={path}
        isActive={isActive(path)}
        onClick={handleNavigation}
        className={className}
      />
    );
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-left">
          <h1 
            onClick={() => handleNavigation('/products')}
            className="navbar-logo"
          >
            당근마켓
          </h1>
          
          {/* 데스크탑 네비게이션 링크 */}
          <div className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                path={item.path}
                isActive={isActive(item.path)}
                onClick={handleNavigation}
              />
            ))}
            {renderAuthButton()}
          </div>
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="메뉴 열기">
          <MenuIcon />
        </button>
      </nav>

      {/* 모바일 사이드 메뉴 오버레이 */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-title">당근마켓</div>
            <button className="mobile-menu-close" onClick={toggleMenu} aria-label="메뉴 닫기">
              <CloseIcon />
            </button>
          </div>
          
          <div className="mobile-menu-list">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                path={item.path}
                isActive={isActive(item.path)}
                onClick={handleNavigation}
                className="mobile-menu-item"
              />
            ))}
            
            <hr style={{ margin: '10px 20px', border: 'none', borderTop: '1px solid #eee' }} />
            
            {renderAuthButton(true)}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
