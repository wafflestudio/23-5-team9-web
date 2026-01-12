import { useState, useEffect, useCallback } from 'react';
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

import { userApi, User } from './api/user';

import './styles/common.css';
import './styles/app.css';

function App() {
  const [isMainLoggedIn, setIsMainLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 2. API 호출 함수
  const fetchUserData = useCallback(async (token: string): Promise<User | null> => {
    try {
      const res = await userApi.getMe();
      
      if (res.ok) {
        const data = await res.json();
        return data as User;
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    }
    return null; 
  }, []);


  // 3. 로그인 상태 체크 및 유저 정보 로드
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!isMainLoggedIn || !token) {
      setNeedsOnboarding(false); // 로그아웃 시 초기화
      return;
    }

    (async () => {
      const data = await fetchUserData(token);
      if (data) {
        // [부활] 받아온 데이터를 기반으로 State 업데이트
        setNeedsOnboarding(!data.nickname || !data.region);
      }
    })();
  }, [isMainLoggedIn, location.pathname, fetchUserData]);


  // 4. 소셜 로그인 후처리
  useEffect(() => {
    // 문자열 파싱
    // 1. (location.search) "?access_token=ab123&refresh_token=xy987" 
    // 2. (accessToken) "ab123"
    // 3. (refreshToken) "xy987"
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // 1. (localStorage) 브라우저에 보관하기
      // 2. (setIsMainLoggedIn) 리액트에게 상태 변경 알리기
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setIsMainLoggedIn(true);
      
      // 주소창에서 토큰 삭제 (?access_token=abcd123...)
      // 페이지 새로고침 없이 진행
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const handleSocialLogin = async () => {
        const data = await fetchUserData(accessToken);
        
        if (data) {
          const isMissingInfo = !data.nickname || !data.region;
          setNeedsOnboarding(isMissingInfo); // State 업데이트

          if (isMissingInfo) {
            navigate('/onboarding');
          } else {
            navigate('/products');
          }
        } else {
            navigate('/products');
        }
      };

      handleSocialLogin();
    }
  }, [location, navigate, fetchUserData]); 

  // 로그아웃
  const handleLogout = () => {
    setIsMainLoggedIn(false);
    setNeedsOnboarding(false); // 초기화
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/products');
  };

  // 로그인
  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };

  const currentPath = location.pathname;

  // "서비스 이용을 위해 닉네임과 지역 설정이 필요합니다"
  // 1. 로그인함
  // 2. 온보딩이 필요함
  // 3. 온보딩 페이지가 아님
  const shouldShowBanner = isMainLoggedIn && needsOnboarding && currentPath !== '/onboarding';
  
  // "당근마켓 : 중고거래, 동네생활, 동네지도..."
  // 제외 대상 -> 로그인, 회원가입, 온보딩
  const isAuthPage = ['/login', '/signup', '/onboarding'].includes(currentPath);
  const shouldShowNav = !isAuthPage;

  return (
    <div className="app-container">

      {/* Header Container */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
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
        {shouldShowNav && <NavBar isLoggedIn={isMainLoggedIn} />}
      </div>
      
      {/* Main Content */}
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
          <Route path="/my" element={<MyCarrot onLogout={handleLogout} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login onLogin={handleMainLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleMainLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;