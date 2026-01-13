import { Routes, Route, Navigate } from "react-router-dom";

import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import Onboarding from '@/features/auth/pages/Onboarding';
import ChatList from '@/features/chat/pages/ChatList';
import ChatRoom from '@/features/chat/pages/ChatRoom';
import MyCarrot from '@/features/user/pages/MyCarrot';
import NeighborhoodMap from '@/features/location/pages/NeighborhoodMap';
import ProductList from '@/features/product/pages/ProductList';
import ProductDetail from '@/features/product/pages/ProductDetail';
import CommunityList from '@/features/community/pages/CommunityList';
import CommunityDetail from '@/features/community/pages/CommunityDetail';

import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { SocialLoginHandler } from '@/features/auth/components/SocialLoginHandler';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { AuthLayout } from '@/features/auth/layouts/AuthLayout';

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