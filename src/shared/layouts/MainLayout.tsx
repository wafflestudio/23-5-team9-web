import { Outlet } from 'react-router-dom';
import NavBar from '../ui/NavBar';
import { OnboardingBanner } from '@/features/auth/components/OnboardingBanner';
import { useUser } from '@/features/user/hooks/useUser';

export function MainLayout() {
  const { isLoggedIn } = useUser();

  return (
    <div className="min-h-screen bg-bg-page">
       <OnboardingBanner />
       <div className="sticky top-0 z-[1000] w-full">
         <NavBar isLoggedIn={isLoggedIn} />
       </div>
       <div className="w-full mx-auto">
         <Outlet />
       </div>
    </div>
  );
}
