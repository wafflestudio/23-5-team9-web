import { Routes, Route, Navigate } from "react-router-dom";

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
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import './styles/common.css';
import './styles/app.css';

// 내부 컴포넌트로 분리 (AuthContext를 사용하기 위해)
function AppContent() {
  const { checkAuth, logout } = useAuth();

  // 로그인/회원가입 완료 시 호출될 핸들러
  const handleAuthSuccess = () => {
    checkAuth();
  };

  return (
    <>
      <SocialLoginHandler />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/community" element={<CommunityList />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/map" element={<NeighborhoodMap/>}/>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/my" element={<MyCarrot onLogout={logout} />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login onLogin={handleAuthSuccess} />} />
          <Route path="/signup" element={<Signup onSignup={handleAuthSuccess} />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </>
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