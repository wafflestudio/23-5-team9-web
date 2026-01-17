import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from '@/shared/layouts/MainLayout';
import { SocialLoginHandler } from '@/features/auth/components/SocialLoginHandler';

// Page Imports
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

function App() {
  return (
    <>
      <SocialLoginHandler />
      <Routes>
        {/* 모든 페이지를 MainLayout 하나로 통합 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          
          {/* 기존 메인 서비스 */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/community" element={<CommunityList />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/map" element={<NeighborhoodMap/>}/>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/my" element={<MyCarrot />} />

          {/* 인증 페이지도 이곳으로 통합 */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
