import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

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

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocialLoginHandler } from './components/SocialLoginHandler';
import './styles/common.css';
import './styles/app.css';

// 내부 컴포넌트로 분리 (AuthContext를 사용하기 위해)
function AppContent() {
  const { isLoggedIn, needsOnboarding, checkAuth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 기존 App.tsx에 있던 배너 노출 로직
  const shouldShowBanner = isLoggedIn && needsOnboarding && location.pathname !== '/onboarding';
  
  // NavBar 노출 로직
  const isAuthPage = ['/login', '/signup', '/onboarding'].includes(location.pathname);

  // 로그인/회원가입 완료 시 호출될 핸들러
  const handleAuthSuccess = () => {
    checkAuth();
  };

  return (
    <div className="app-container">
      {/* 소셜 로그인 URL 감지용 (보이지 않는 컴포넌트) */}
      <SocialLoginHandler />

      <div className="sticky-header-container">
        {shouldShowBanner && (
          <div className="onboarding-banner">
            <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다</span>
            <button 
              onClick={() => navigate('/onboarding')}
              className="onboarding-banner-button"
            >
              설정하러 가기
            </button>
          </div>
        )}
        {!isAuthPage && <NavBar isLoggedIn={isLoggedIn} />}
      </div>
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/community" element={<CommunityList />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/map" element={<NeighborhoodMap/>}/>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/my" element={<MyCarrot onLogout={logout} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login onLogin={handleAuthSuccess} />} />
          <Route path="/signup" element={<Signup onSignup={handleAuthSuccess} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;