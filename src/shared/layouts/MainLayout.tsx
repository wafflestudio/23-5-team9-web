import { Outlet } from 'react-router-dom';
import NavBar from '../ui/NavBar';
import { OnboardingBanner } from '@/features/auth/components/OnboardingBanner';
import { useAuth } from '@/features/auth/context/AuthContext';

export function MainLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="app-container">
       <OnboardingBanner /> 
       <div className="sticky-header-container">
         <NavBar isLoggedIn={isLoggedIn} />
       </div>
       <div className="main-content">
         <Outlet /> 
       </div>
    </div>
  );
}
