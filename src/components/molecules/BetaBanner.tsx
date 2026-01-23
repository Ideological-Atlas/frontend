'use client';

import { useTranslations } from 'next-intl';

export function BetaBanner() {
  const t = useTranslations('Common');

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-center text-xs font-medium text-amber-700 backdrop-blur-sm dark:text-amber-500">
      <p>
        {t.rich('beta_warning', {
          email: chunks => (
            <a
              href="mailto:support@ideologicalatlas.com"
              className="font-bold underline transition-colors hover:text-amber-900 dark:hover:text-amber-400"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
}
