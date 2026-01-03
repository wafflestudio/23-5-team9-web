import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/dangeun/login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dangeun/jobs');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    navigate('/dangeun/jobs');
  };

  // Hide NavBar on login/signup pages
  const hideNav = location.pathname === '/dangeun/login' || location.pathname === '/dangeun/signup';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <div style={{ 
        paddingTop: !hideNav ? '64px' : '0',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dangeun/jobs?page=0" replace />} />
          <Route path="/dangeun" element={<Navigate to="/dangeun/jobs?page=0" replace />} />
          <Route path="/dangeun/jobs" element={<Home/>}/>
          <Route path="/dangeun/products" element={<ProductList />} />
          <Route path="/dangeun/products/:id" element={<ProductDetail />} />
          <Route path="/dangeun/map" element={<NeighborhoodMap/>}/>
          <Route path="/dangeun/posts/:id" element={<PostDetail/>}/>
          <Route path="/dangeun/chat" element={<ChatList />} />
          <Route path="/dangeun/chat/:chatId" element={<ChatRoom />} />
          <Route path="/dangeun/my" element={<MyCarrot />} />
          
          <Route path="/dangeun/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dangeun/signup" element={<Signup onSignup={handleSignup} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
