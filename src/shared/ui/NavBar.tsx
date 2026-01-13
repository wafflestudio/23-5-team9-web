import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../../styles/navbar.css';

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

const NavButton = ({ label, path, isActive, onClick, className = '' }: NavButtonProps) => (
  <button
    onClick={() => onClick(path)}
    className={`${className} ${isActive ? 'text-primary font-bold' : ''}`}
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
    const defaultClasses = isMobile 
        ? "p-4 text-lg font-medium text-dark border-none bg-transparent text-left cursor-pointer hover:bg-light w-full block" 
        : "px-3 py-2 text-base bg-transparent text-gray border-none cursor-pointer font-bold transition-colors duration-200";
    
    const label = isLoggedIn ? '나의 당근' : '로그인';
    const path = isLoggedIn ? '/my' : '/login';

    return (
      <NavButton
        label={label}
        path={path}
        isActive={isActive(path)}
        onClick={handleNavigation}
        className={defaultClasses}
      />
    );
  };

  return (
    <>
      <nav className="w-full h-16 bg-white border-b border-border flex items-center justify-between px-5 relative z-[1000] transition-[top] duration-200">
        <div className="flex items-center flex-1 md:flex-initial md:gap-10">
          <h1 
            onClick={() => handleNavigation('/products')}
            className="text-primary text-2xl font-bold cursor-pointer m-0"
          >
            당근마켓
          </h1>
          
          {/* 데스크탑 네비게이션 링크 */}
          <div className="hidden md:flex md:gap-5 md:items-center">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                path={item.path}
                isActive={isActive(item.path)}
                onClick={handleNavigation}
                className="px-3 py-2 text-base bg-transparent text-gray border-none cursor-pointer font-bold transition-colors duration-200"
              />
            ))}
            {renderAuthButton()}
          </div>
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <button className="block md:hidden p-2 bg-transparent border-none text-dark cursor-pointer" onClick={toggleMenu} aria-label="메뉴 열기">
          <MenuIcon />
        </button>
      </nav>

      {/* 모바일 사이드 메뉴 오버레이 */}
      <div className={`fixed top-0 right-0 w-full h-full bg-black/50 z-[2000] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu}>
        <div className={`absolute top-0 right-0 w-[70%] max-w-[320px] h-full bg-white transition-transform duration-300 ease-in-out flex flex-col shadow-[-2px_0_8px_rgba(0,0,0,0.1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div className="font-bold text-lg text-primary">당근마켓</div>
            <button className="bg-transparent border-none text-2xl cursor-pointer text-gray p-1" onClick={toggleMenu} aria-label="메뉴 닫기">
              <CloseIcon />
            </button>
          </div>
          
          <div className="flex flex-col py-5 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                path={item.path}
                isActive={isActive(item.path)}
                onClick={handleNavigation}
                className="p-4 text-lg font-medium text-dark border-none bg-transparent text-left cursor-pointer hover:bg-light w-full block"
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
