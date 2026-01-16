import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { SocialLoginHandler } from '@/features/auth/components/SocialLoginHandler';

// Page Imports
import Login from '@/features/auth/pages/Login';
import Signup from '@/features/auth/pages/Signup';
import Onboarding from '@/features/auth/pages/Onboarding';
import MyCarrot from '@/features/user/pages/MyCarrot';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocialLoginHandler />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/my" replace />} />
            <Route path="/my" element={<MyCarrot />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
