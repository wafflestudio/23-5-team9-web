import { useState } from 'react';
import { Button, StatCard } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useUser } from '@/features/user/hooks/useUser';
import { useMyPay } from '@/features/pay/hooks/useMyPay';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

type Mode = 'deposit' | 'withdraw';

export default function CoinTab() {
  const [mode, setMode] = useState<Mode>('deposit');
  const t = useTranslation();
  const { user, needsOnboarding } = useUser();
  const { depositCoin, withdrawCoin } = useMyPay();

  const handleAction = (amount: number) => {
    if (mode === 'deposit') {
      depositCoin(amount);
    } else {
      withdrawCoin(amount);
    }
  };

  if (needsOnboarding) {
    return (
      <PageContainer title={t.pay.coinManagement}>
        <OnboardingRequired />
      </PageContainer>
    );
  }

  return (
    <div className="text-center py-5">
      <StatCard
        label={t.pay.ownedCoins}
        value={user?.coin.toLocaleString() || '0'}
        unit="C"
        layout="vertical"
        variant="outline"
        className="mb-7.5"
      />

      <div className="flex gap-2 justify-center mb-5">
        <Button
          onClick={() => setMode('deposit')}
          variant={mode === 'deposit' ? 'primary' : 'outline'}
          size="sm"
        >
          {t.pay.charge}
        </Button>
        <Button
          onClick={() => setMode('withdraw')}
          variant={mode === 'withdraw' ? 'primary' : 'outline'}
          size="sm"
        >
          {t.pay.withdraw}
        </Button>
      </div>

      <h4 className="mb-5 text-text-secondary font-bold">
        {mode === 'deposit' ? t.pay.chargeCoins : t.pay.withdrawCoins}
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
    </div>
  );
}
