import { PayTransaction } from '@/features/pay/api/payApi';
import { Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core';

interface TransactionItemProps {
  tx: PayTransaction;
  currentUserId?: string;
}

const txConfig = {
  positive: { sign: '+', colors: { transfer: 'blue', other: 'orange' } },
  negative: { sign: '-', colors: { transfer: 'grape', other: 'red' } },
} as const;

export function TransactionItem({ tx, currentUserId }: TransactionItemProps) {
  const t = useTranslation();
  const { language } = useLanguage();

  const isTransfer = tx.type === 'TRANSFER';
  const isSender = isTransfer && tx.details.user.id === currentUserId;

  const info = tx.type === 'DEPOSIT' ? { label: t.pay.charge, icon: '↓', isPositive: true }
    : tx.type === 'WITHDRAW' ? { label: t.pay.withdraw, icon: '↑', isPositive: false }
    : isSender ? { label: t.pay.transfer, icon: '→', isPositive: false }
    : { label: t.pay.received, icon: '←', isPositive: true };

  const { sign, colors } = info.isPositive ? txConfig.positive : txConfig.negative;
  const color = isTransfer ? colors.transfer : colors.other;
  const formattedDate = new Date(tx.details.time).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US');

  const otherParty = isTransfer && 'receive_user' in tx.details
    ? (isSender ? tx.details.receive_user : tx.details.user)
    : null;

  return (
    <Box p="md" style={{ borderRadius: 'var(--mantine-radius-md)', borderLeft: `4px solid var(--mantine-color-${color}-5)`, backgroundColor: `var(--mantine-color-${color}-0)` }}>
      <Group gap="sm" wrap="nowrap">
        {isTransfer ? (
          <Avatar src={otherParty?.profile_image ?? undefined} alt={otherParty?.nickname || t.common.unknown} size="sm" />
        ) : (
          <ThemeIcon color={color} size="lg" radius="xl">{info.icon}</ThemeIcon>
        )}
        <Stack gap={2} style={{ flex: 1 }}>
          <Text size="sm" fw={500}>{info.label}{isTransfer && ` · ${otherParty?.nickname || t.common.unknown}`}</Text>
          <Text size="xs" c="dimmed">{formattedDate}</Text>
        </Stack>
        <Text fw={700} fz="lg" c={color}>{sign}{tx.details.amount.toLocaleString()}C</Text>
      </Group>
    </Box>
  );
}
