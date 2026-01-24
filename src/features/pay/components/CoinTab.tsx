import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/features/user/api/user';
import { Button, StatCard } from '@/shared/ui';

import { useUser } from '@/features/user/hooks/useUser';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

interface CoinTabProps {
  user: User;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

type Mode = 'deposit' | 'withdraw';

const CoinTab = ({ user, onDeposit, onWithdraw }: CoinTabProps) => {
  const [mode, setMode] = useState<Mode>('deposit');
  const navigate = useNavigate();

  const handleAction = (amount: number) => {
    if (mode === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
  };

  const { needsOnboarding } = useUser();

  if (needsOnboarding) {
    return (
      <PageContainer title="코인 관리">
        <OnboardingRequired />
      </PageContainer>
    );
  }

  return (
    <div className="text-center py-5">
      <StatCard
        label="보유 코인"
        value={user.coin.toLocaleString()}
        unit="C"
        layout="vertical"
        variant="outline"
        className="mb-[30px]"
      />

      <div className="flex gap-2 justify-center mb-5">
        <Button
          onClick={() => setMode('deposit')}
          variant={mode === 'deposit' ? 'primary' : 'outline'}
          size="sm"
        >
          충전
        </Button>
        <Button
          onClick={() => setMode('withdraw')}
          variant={mode === 'withdraw' ? 'primary' : 'outline'}
          size="sm"
        >
          출금
        </Button>
      </div>

      <h4 className="mb-5 text-text-secondary font-bold">
        {mode === 'deposit' ? '코인 충전하기' : '코인 출금하기'}
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
          <Button
            key={amount}
            onClick={() => handleAction(amount)}
            variant="outline"
            className={
              mode === 'deposit'
                ? 'hover:border-primary hover:text-primary hover:bg-primary-light'
                : 'hover:border-status-error hover:text-status-error hover:bg-status-error-hover'
            }
          >
            {mode === 'deposit' ? '+' : '-'}{amount.toLocaleString()}
          </Button>
        ))}
      </div>

      <div className="mt-8 pt-4">
        <button
          onClick={() => navigate('/my/transactions')}
          className="inline-flex items-center justify-center gap-1 text-sm text-text-secondary hover:text-text-heading transition-colors"
        >
          <span>거래 내역 보기</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CoinTab;
