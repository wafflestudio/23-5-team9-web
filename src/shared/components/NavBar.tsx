import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '@mantine/core';
import { IconMenu2, IconX, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/shared/store/themeStore';
import { useLanguage } from '@/shared/store/languageStore';
import { useTranslation } from '@/shared/i18n';
import { useChatRooms } from '@/features/chat/hooks/useChat';
import { POLLING_CONFIG, getPollingInterval } from '@/shared/config/polling';

export default function NavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const t = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MENUS = [
    { id: 'products', label: t.nav.products, path: '/products' },
    { id: 'chat', label: t.nav.chat, path: '/chat' },
  ];

  const { totalUnreadCount } = useChatRooms({
    refetchInterval: getPollingInterval(POLLING_CONFIG.UNREAD_COUNT, isLoggedIn),
    enabled: isLoggedIn,
  });

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const NavItem = ({ label, path, mobile = false }: { label: string, path: string, mobile?: boolean }) => {
    const isActive = pathname.startsWith(path);
    const mobileStyle = mobile ? "w-full text-left text-lg" : "";
    const activeStyle = isActive ? "text-primary font-bold" : "text-text-body font-medium";
    const isChat = path === '/chat';
    const showBadge = isChat && totalUnreadCount > 0;

    return (
      <Button
        onClick={() => handleNav(path)}
        variant="subtle"
        color="gray"
        className={`${mobileStyle} ${activeStyle} gap-2`}
      >
        {label}
        {showBadge && (
          <Badge color="red" size="sm" circle>
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </Badge>
        )}
      </Button>
    );
  };

  const authItem = { label: isLoggedIn ? t.nav.myCarrot : t.nav.login, path: isLoggedIn ? '/my' : '/auth/login' };

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-bg-page px-5 shadow-sm">
        <div className="flex items-center gap-10">
          <h1 onClick={() => handleNav('/products')} className="cursor-pointer text-2xl font-bold text-primary">
            {t.nav.carrotMarket}
          </h1>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {MENUS.map(menu => <NavItem key={menu.id} {...menu} />)}
            <NavItem {...authItem} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 언어 토글 */}
          <Button
            onClick={toggleLanguage}
            variant="subtle"
            color="gray"
            className="p-2 text-sm font-medium"
            aria-label={t.nav.langToggle}
          >
            {t.nav.langLabel}
          </Button>

          {/* 다크모드 토글 */}
          <Button
            onClick={toggleTheme}
            variant="subtle"
            color="gray"
            className="p-2"
            aria-label={t.nav.themeToggle}
          >
            {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </Button>

          {/* 모바일 햄버거 버튼 */}
          <Button variant="subtle" color="gray" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <IconMenu2 size={24} />
          </Button>
        </div>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      <div className={`fixed inset-0 z-2000 bg-bg-overlay transition-opacity ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={() => setIsMenuOpen(false)}>
        <div
          className={`absolute right-0 h-full w-[70%] max-w-75 bg-bg-page shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-lg font-bold text-primary">{t.nav.carrotMarket}</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleLanguage}
                variant="subtle"
                color="gray"
                className="p-2 text-sm font-medium"
                aria-label={t.nav.langToggle}
              >
                {t.nav.langLabel}
              </Button>
              <Button
                onClick={toggleTheme}
                variant="subtle"
                color="gray"
                className="p-2"
                aria-label={t.nav.themeToggle}
              >
                {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </Button>
              <Button variant="subtle" color="gray" onClick={() => setIsMenuOpen(false)}>
                <IconX size={24} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col py-2">
            {MENUS.map(menu => <NavItem key={menu.id} {...menu} mobile />)}
            <NavItem {...authItem} mobile />
          </div>
        </div>
      </div>
    </>
  );
}
