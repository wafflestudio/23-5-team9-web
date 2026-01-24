import { useTransactions } from '@/features/pay/hooks/useTransactions';
import { PayTransaction } from '@/features/pay/api/payApi';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Button, DetailHeader, Avatar } from '@/shared/ui';
import { useUser } from '@/features/user/hooks/useUser';
import { OnboardingRequired } from '@/shared/ui';

const TransactionItem = ({ tx, currentUserId }: { tx: PayTransaction; currentUserId?: string }) => {
  const isTransfer = tx.type === 'TRANSFER';
  const isSender = isTransfer && tx.details.user.id === currentUserId;

  const getTransactionInfo = () => {
    if (tx.type === 'DEPOSIT') {
      return { label: '충전', icon: '↓', isPositive: true };
    }
    if (tx.type === 'WITHDRAW') {
      return { label: '출금', icon: '↑', isPositive: false };
    }
    // TRANSFER
    if (isSender) {
      return { label: '송금', icon: '→', isPositive: false };
    }
    return { label: '받음', icon: '←', isPositive: true };
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
          alt={otherParty?.nickname || '사용자'}
          size="sm"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-text-primary">
            {label} · {otherParty?.nickname || '알 수 없음'}
          </p>
          <p className="text-xs text-text-tertiary">
            {new Date(tx.details.time).toLocaleString('ko-KR')}
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
          {new Date(tx.details.time).toLocaleString('ko-KR')}
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

function TransactionHistory() {
  const { user, needsOnboarding } = useUser();
  const { transactions, isLoading, loadMore, hasMore } = useTransactions();

  if (needsOnboarding) {
    return (
      <PageContainer title="거래 내역">
        <OnboardingRequired />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DetailHeader />
      <h2 className="text-2xl font-extrabold mb-6">거래 내역</h2>

      {isLoading && transactions.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-8">로딩 중...</p>
      ) : transactions.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-8">거래 내역이 없습니다.</p>
      ) : (
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
              {isLoading ? '로딩 중...' : '더보기'}
            </Button>
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default TransactionHistory;
