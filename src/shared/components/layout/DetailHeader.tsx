import { useNavigate } from 'react-router-dom';
import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from '@/shared/i18n';

interface DetailHeaderProps {
  title?: string;
  rightSection?: React.ReactNode;
}

export function DetailHeader({ title, rightSection }: DetailHeaderProps) {
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <Box mb="md">
      <Group justify="space-between">
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => navigate(-1)}
            aria-label={t.layout.goBack}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          {title && (
            <Text fw={600} size="lg" c="slate.9">
              {title}
            </Text>
          )}
        </Group>
        {rightSection}
      </Group>
    </Box>
  );
}
