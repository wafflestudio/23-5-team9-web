import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { OnboardingBanner } from '../components/OnboardingBanner';
import { useAuth } from '../contexts/AuthContext';

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
