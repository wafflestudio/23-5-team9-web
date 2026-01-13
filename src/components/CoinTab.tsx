import { User } from '../api/user';

interface CoinTabProps {
  user: User;
  onCharge: (amount: number) => void;
}

const CoinTab = ({ user, onCharge }: CoinTabProps) => (
  <div className="coin-section">
    <div className="coin-balance-card">
      <h3 className="coin-balance-title">보유 코인</h3>
      <div className="coin-amount">
        {user.coin.toLocaleString()} <span className="coin-unit">C</span>
      </div>
    </div>
    <h4 className="coin-charge-title">코인 충전하기</h4>
    <div className="coin-charge-grid">
      {[1000, 5000, 10000, 30000, 50000, 100000].map((amount) => (
        <button key={amount} onClick={() => onCharge(amount)} className="coin-charge-button">
          +{amount.toLocaleString()}
        </button>
      ))}
    </div>
  </div>
);

export default CoinTab;
