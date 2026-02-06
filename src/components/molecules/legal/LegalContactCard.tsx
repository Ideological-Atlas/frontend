'use client';

import { useTranslations } from 'next-intl';

export function LegalContactCard() {
  const t = useTranslations('Terms');

  return (
    <div className="bg-secondary/20 border-border flex flex-col items-center justify-between gap-4 rounded-xl border p-6 md:flex-row">
      <div className="text-center md:text-left">
        <p className="text-foreground mb-1 font-bold">{t('contact_community.title')}</p>
        <p className="text-muted-foreground text-sm">{t('contact_community.desc')}</p>
      </div>
      <a
        href="mailto:legal@ideologicalatlas.org"
        className="bg-card text-primary hover:text-primary-hover border-border flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold shadow-sm transition-colors hover:shadow-md"
      >
        <span className="material-symbols-outlined text-[18px]">group</span>
        {t('contact_community.btn')}
      </a>
    </div>
  );
}
