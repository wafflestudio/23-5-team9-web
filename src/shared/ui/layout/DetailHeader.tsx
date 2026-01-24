import { useNavigate } from 'react-router-dom';
import { Button } from '../display/Button';
import { useTranslation } from '@/shared/i18n';

export function DetailHeader() {
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="pl-0 hover:bg-transparent hover:text-primary"
      >
        {t.layout.goBack}
      </Button>
    </div>
  );
}
