import { useTransactions } from '@/features/pay/hooks/useTransactions';
import { PayTransaction } from '@/features/pay/api/payApi';
import { Button, Avatar } from '@/shared/ui';
import { useUser } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';

const TransactionItem = ({ tx, currentUserId }: { tx: PayTransaction; currentUserId?: string }) => {
  const t = useTranslation();
  const { language } = useLanguage();
  const isTransfer = tx.type === 'TRANSFER';
  const isSender = isTransfer && tx.details.user.id === currentUserId;
  const isReceiver = isTransfer && tx.details.receive_user?.id === currentUserId;

  const getTransactionInfo = () => {
    if (tx.type === 'DEPOSIT') {
      return { label: t.pay.charge, icon: '↓', isPositive: true };
    }
    if (tx.type === 'WITHDRAW') {
      return { label: t.pay.withdraw, icon: '↑', isPositive: false };
    }
    // TRANSFER
    if (isSender) {
      return { label: t.pay.transfer, icon: '→', isPositive: false };
    }
    return { label: t.pay.received, icon: '←', isPositive: true };
  };

  const { label, icon, isPositive } = getTransactionInfo();

  // For transfer, show the other party's info
  const otherParty = isTransfer
    ? (isSender ? tx.details.receive_user : tx.details.user)
    : null;

  if (isTransfer) {
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
          isPositive
            ? 'bg-blue-500/10 border-l-blue-500'
            : 'bg-purple-500/10 border-l-purple-500'
        }`}
      >
        <Avatar
          src={otherParty?.profile_image}
          alt={otherParty?.nickname || t.common.unknown}
          size="sm"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-text-primary">
            {label} · {otherParty?.nickname || t.common.unknown}
          </p>
          <p className="text-xs text-text-tertiary">
            {new Date(tx.details.time).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')}
          </p>
        </div>
        <span
          className={`font-bold text-lg ${
            isPositive ? 'text-blue-500' : 'text-purple-500'
          }`}
        >
          {isPositive ? '+' : '-'}
          {tx.details.amount.toLocaleString()}C
        </span>
      </div>
    );
  }

  // Deposit / Withdraw
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
        isPositive ? 'bg-primary/5 border-l-primary' : 'bg-status-error/5 border-l-status-error'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
          isPositive ? 'bg-primary' : 'bg-status-error'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary">
          {new Date(tx.details.time).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')}
        </p>
      </div>
      <span
        className={`font-bold text-lg ${isPositive ? 'text-primary' : 'text-status-error'}`}
      >
        {isPositive ? '+' : '-'}
        {tx.details.amount.toLocaleString()}C
      </span>
    </div>
  );
};

import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

export default function TransactionTab() {
  const { user, needsOnboarding } = useUser();
  const { transactions, isLoading, loadMore, hasMore } = useTransactions();
  const t = useTranslation();

  if (needsOnboarding) {
      return (
        <PageContainer title={t.pay.coinManagement}>
          <OnboardingRequired />
        </PageContainer>
      );
    }

  if (isLoading && transactions.length === 0) {
    return <p className="text-text-tertiary text-sm text-center py-8">{t.common.loading}</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-text-tertiary text-sm text-center py-8">{t.pay.noTransactions}</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} currentUserId={user?.id?.toString()} />
      ))}
      {hasMore && (
        <Button
          onClick={loadMore}
          variant="outline"
          size="sm"
          fullWidth
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? t.common.loading : t.common.loadMore}
        </Button>
      )}
    </div>
  );
}
