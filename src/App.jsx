import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ChatList from './pages/ChatList.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import MyCarrot from './pages/MyCarrot.jsx';
import './styles/common.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  // Hide NavBar on login/signup pages
  const hideNav = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <div style={{ 
        paddingTop: !hideNav ? '64px' : '0',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/posts/:id" element={<PostDetail/>}/>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/my" element={<MyCarrot />} />
          
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
