import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/features/user/hooks/useUser';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { Group, Paper, Text } from '@mantine/core';

export function OnboardingBanner() {
  const { user, needsOnboarding } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  // 온보딩 페이지와 채팅방에서는 배너 숨김
  const isChatRoom = location.pathname.startsWith('/chat/');
  const shouldShowBanner = user && needsOnboarding && location.pathname !== '/auth/onboarding' && !isChatRoom;

  if (!shouldShowBanner) return null;

  return (
    <Paper bg="orange" c="white" py={8} px="md" radius={0}>
      <Group justify="center" gap="sm">
        <Text size="sm" fw={500}>
          {t.auth.onboardingRequired}
        </Text>
        <Button onClick={() => navigate('/auth/onboarding')} variant="secondary" size="sm">
          {t.auth.goToSettings}
        </Button>
      </Group>
    </Paper>
  );
}
