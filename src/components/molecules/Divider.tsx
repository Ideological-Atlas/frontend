import { useTranslations } from 'next-intl';

export function Divider() {
  const t = useTranslations('Auth');

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="border-border w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card text-muted-foreground px-2">{t('or')}</span>
      </div>
    </div>
  );
}
