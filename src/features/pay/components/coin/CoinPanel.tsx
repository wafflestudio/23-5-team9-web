import { useState } from 'react';
import { Button, SegmentedTabBar, StatCard } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

type Mode = 'deposit' | 'withdraw';

const PRESET_AMOUNTS = [1000, 5000, 10000, 30000, 50000, 100000];

interface CoinPanelProps {
  currentCoin: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export function CoinPanel({ currentCoin, onDeposit, onWithdraw }: CoinPanelProps) {
  const [mode, setMode] = useState<Mode>('deposit');
  const t = useTranslation();

  const handleAction = (amount: number) => {
    if (mode === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
  };

  return (
    <div className="text-center py-5">
      <StatCard
        label={t.pay.ownedCoins}
        value={currentCoin.toLocaleString()}
        unit="C"
        layout="vertical"
        variant="outline"
        className="mb-7.5"
      />

      <div className="flex justify-center mb-5">
        <SegmentedTabBar
          tabs={[
            { id: 'deposit', label: t.pay.charge },
            { id: 'withdraw', label: t.pay.withdraw },
          ]}
          activeTab={mode}
          onTabChange={setMode}
        />
      </div>

      <h4 className="mb-5 text-text-secondary font-bold">
        {mode === 'deposit' ? t.pay.chargeCoins : t.pay.withdrawCoins}
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {PRESET_AMOUNTS.map((amount) => (
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
