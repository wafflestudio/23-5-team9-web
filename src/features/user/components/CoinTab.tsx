import { User } from '@/features/user/api/user';
import { Button } from '@/shared/ui/Button';

interface CoinTabProps {
  user: User;
  onCharge: (amount: number) => void;
}

const CoinTab = ({ user, onCharge }: CoinTabProps) => (
  <div className="text-center py-5">
    <div className="bg-[#fff4e6] p-10 rounded-2xl mb-[30px]">
      <h3 className="m-0 text-primary mb-2.5 font-bold">보유 코인</h3>
      <div className="text-5xl font-extrabold text-text-heading">
        {user.coin.toLocaleString()} <span className="text-2xl font-normal ml-1">C</span>
      </div>
    </div>
    <h4 className="mb-5 text-text-secondary">코인 충전하기</h4>
    <div className="grid grid-cols-3 gap-3">
      {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
        <Button
          key={amount}
          onClick={() => onCharge(amount)}
          variant="outline"
          className="hover:border-primary hover:text-primary hover:bg-[#fff4e6]"
        >
          +{amount.toLocaleString()}
        </Button>
      ))}
    </div>
  </div>
);

export default CoinTab;
