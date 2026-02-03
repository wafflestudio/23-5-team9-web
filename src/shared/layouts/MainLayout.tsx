import { Outlet } from 'react-router-dom';
import { NavBar } from '@/shared/ui';
import { OnboardingBanner } from '../../features/auth/components/OnboardingBanner';
import { useUser } from '@/features/user/hooks/useUser';
import { Box } from '@mantine/core';
import { APP_Z_INDEX } from '@/shared/ui/theme/zIndex';

export function MainLayout() {
  const { isLoggedIn } = useUser();

  return (
    <Box mih="100dvh" bg="var(--bg-page)">
      <Box pos="sticky" top={0} style={{ zIndex: APP_Z_INDEX.header }}>
        <OnboardingBanner />
        <NavBar isLoggedIn={isLoggedIn} />
      </Box>
      <Box w="100%" mx="auto">
        <Outlet />
      </Box>
    </Box>
  );
}
