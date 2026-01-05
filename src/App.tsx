import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import MyCarrot from './pages/MyCarrot';
import NeighborhoodMap from './pages/NeighborhoodMap';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import './styles/common.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await fetch('http://127.0.0.1:8000/api/auth/tokens', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      navigate('/23-5-team9-web/login');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/23-5-team9-web/products');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    navigate('/23-5-team9-web/products');
  };

  // Hide NavBar on login/signup pages
  const hideNav = location.pathname === '/23-5-team9-web/login' || location.pathname === '/23-5-team9-web/signup';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <div style={{ 
        paddingTop: !hideNav ? '64px' : '0',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/23-5-team9-web/products?page=0" replace />} />
          <Route path="/23-5-team9-web" element={<Navigate to="/23-5-team9-web/products?page=0" replace />} />
          <Route path="/23-5-team9-web/products" element={<ProductList />} />
          <Route path="/23-5-team9-web/products/:id" element={<ProductDetail />} />
          <Route path="/23-5-team9-web/map" element={<NeighborhoodMap/>}/>
          <Route path="/23-5-team9-web/chat" element={<ChatList />} />
          <Route path="/23-5-team9-web/chat/:chatId" element={<ChatRoom />} />
          <Route path="/23-5-team9-web/my" element={<MyCarrot />} />
          
          <Route path="/23-5-team9-web/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/23-5-team9-web/signup" element={<Signup onSignup={handleSignup} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
