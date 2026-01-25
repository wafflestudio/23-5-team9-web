import { useTranslation } from '@/shared/i18n';

export function Loading() {
  const t = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="w-8 h-8 border-4 border-border-base border-t-primary rounded-full animate-spin mb-3"></div>
      <div className="text-text-secondary text-sm font-medium">{t.common.loading}</div>
    </div>
  );
}
