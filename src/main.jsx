import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import NavBar from './components/NavBar.jsx';
import PostBody from './PostBody.jsx';
import PostIndex from './PostIndex.jsx'; 
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';
import ChatList from './ChatList.jsx';
import ChatRoom from './ChatRoom.jsx';
import MyCarrot from './MyCarrot.jsx';
import './styles/common.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/React-Week5/login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/React-Week5');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    navigate('/React-Week5');
  };

  // Hide NavBar on login/signup pages
  const hideNav = location.pathname === '/React-Week5/login' || location.pathname === '/React-Week5/signup';

  return (
    <div style={{ display: 'flex' }}>
      {!hideNav && <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <div style={{ 
        flex: 1, 
        marginLeft: !hideNav ? '250px' : '0', 
        minHeight: '100vh', 
        backgroundColor: '#fff',
        width: !hideNav ? 'calc(100% - 250px)' : '100%'
      }}>
        <Routes>
          <Route path="/React-Week5" element={<PostIndex/>}/>
          <Route path="/React-Week5/:id" element={<PostBody/>}/>
          <Route path="/React-Week5/chat" element={<ChatList />} />
          <Route path="/React-Week5/chat/:chatId" element={<ChatRoom />} />
          <Route path="/React-Week5/my" element={<MyCarrot />} />
          
          <Route path="/React-Week5/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/React-Week5/signup" element={<SignupForm onSignup={handleSignup} />} />
        </Routes>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <Router>
    <AppLayout />
  </Router>
);
