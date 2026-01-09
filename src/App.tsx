import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import MyCarrot from './pages/MyCarrot';
import NeighborhoodMap from './pages/NeighborhoodMap';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CommunityList from './pages/CommunityList';
import CommunityDetail from './pages/CommunityDetail';
import { MAIN_API_URL } from './api/config';
import './styles/common.css';

function App() {
  const [isMainLoggedIn, setIsMainLoggedIn] = useState(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (isMainLoggedIn && token) {
        try {
          const res = await fetch(`${MAIN_API_URL}/api/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (!data.nickname || !data.region) {
              setNeedsOnboarding(true);
            } else {
              setNeedsOnboarding(false);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkUser();
  }, [isMainLoggedIn, location.pathname]); // Check on login state change or navigation

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setIsMainLoggedIn(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dangeun/community');
    }
  }, [location, navigate]);

  const isLoggedIn = isMainLoggedIn;

  const handleLogout = () => {
    setIsMainLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/dangeun/products');
  };

  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };
  
  const hideNav = 
    location.pathname === '/dangeun/login' || 
    location.pathname === '/dangeun/signup' ||
    location.pathname === '/dangeun/onboarding';
    
  // Don't show banner on onboarding page itself
  const showBanner = needsOnboarding && location.pathname !== '/dangeun/onboarding' && isMainLoggedIn;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {showBanner && (
        <div style={{
          backgroundColor: '#ff6f0f',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 500
        }}>
          <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다.</span>
          <button 
            onClick={() => navigate('/dangeun/onboarding')}
            style={{
              backgroundColor: 'white',
              color: '#ff6f0f',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            설정하러 가기
          </button>
        </div>
      )}
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} hasBanner={!!showBanner} />}
      <div style={{ 
        paddingTop: showBanner ? (!hideNav ? '114px' : '50px') : (!hideNav ? '64px' : '0'), 
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dangeun/products" replace />} />
          <Route path="/dangeun" element={<Navigate to="/dangeun/products" replace />} />
          
          {/* Main Site Routes */}
          <Route path="/dangeun/products" element={<ProductList />} />
          <Route path="/dangeun/products/:id" element={<ProductDetail />} />
          <Route path="/dangeun/community" element={<CommunityList />} />
          <Route path="/dangeun/community/:id" element={<CommunityDetail />} />
          <Route path="/dangeun/map" element={<NeighborhoodMap/>}/>
          <Route path="/dangeun/chat" element={<ChatList />} />
          <Route path="/dangeun/chat/:chatId" element={<ChatRoom />} />
          <Route path="/dangeun/my" element={<MyCarrot onLogout={handleLogout} />} />
          <Route path="/dangeun/onboarding" element={<Onboarding />} />
          
          <Route path="/dangeun/login" element={<Login onLogin={handleMainLogin} />} />
          <Route path="/dangeun/signup" element={<Signup onSignup={handleMainLogin} />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
