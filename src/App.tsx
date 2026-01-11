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
import './styles/app.css';

function App() {
  const [isMainLoggedIn, setIsMainLoggedIn] = useState(!!localStorage.getItem('token'));
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Banner 띄울지 말지 정하기
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
  }, [isMainLoggedIn, location.pathname]); 
  // isMaingLoggedIn (로그인 상태)
  // location.pathname (페이지 이동)


  // 소셜 로그인 성공 후 후처리 로직
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
      
      // 유저 정보 확인 (nickname, region)
      fetch(`${MAIN_API_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch user');
      })
      .then(data => {
        // 온보딩이 필요한 경우
        if (!data.nickname || !data.region) {
          navigate('/dangeun/onboarding');
        } 
        // 그렇지 않은 경우
        else { 
          navigate('/dangeun/products'); 
        }
      }) 
      .catch((e) => {
        console.error(e);
        navigate('/dangeun/products');
      });
    }
  }, [location, navigate]); 
  // location (주소창 정보)
  // navigate (함수 의존성 반영)

  // 로그아웃 로직
  const handleLogout = () => {
    setIsMainLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/dangeun/products');
  };

  // 로그인 로직
  const handleMainLogin = () => {
    setIsMainLoggedIn(true);
  };

  // currentPath
  const currentPath = location.pathname;

  // "서비스 이용을 위해 닉네임과 지역 설정이 필요합니다"
  // 1. 로그인함
  // 2. 온보딩이 필요함
  // 3. 온보딩 페이지가 아님
  const shouldShowBanner = isMainLoggedIn && needsOnboarding && currentPath !== '/dangeun/onboarding';
  
  // "당근마켓 : 중고거래, 동네생활, 동네지도..."
  // 제외 대상 -> 로그인, 회원가입, 온보딩
  const isAuthPage = ['/dangeun/login', '/dangeun/signup', '/dangeun/onboarding'].includes(currentPath);
  const shouldShowNav = !isAuthPage;

  return (
    <div className="app-container">

      {/* Header Container (Sticky) */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
        {/* Banner */}
        {shouldShowBanner && (
          <div className="onboarding-banner">
            <span>서비스 이용을 위해 닉네임과 지역 설정이 필요합니다.</span>
            <button 
              onClick={() => navigate('/dangeun/onboarding')}
              className="onboarding-banner-button"
            >
              설정하러 가기
            </button>
          </div>
        )}
        {/* Navigation */}
        {shouldShowNav && <NavBar isLoggedIn={isMainLoggedIn} />}
      </div>
      
      {/* main */}
      <div className="main-content">
        <Routes>
          {/* Redirection */}
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
