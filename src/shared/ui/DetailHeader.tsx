import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export function DetailHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="pl-0 hover:bg-transparent hover:text-primary"
      >
        ← 뒤로가기
      </Button>
    </div>
  );
}
