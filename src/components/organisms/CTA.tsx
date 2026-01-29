'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/components/atoms/SmartLink';
import { Button } from '../atoms/Button';
import { useAuthStore } from '@/store/useAuthStore';

export function CTA() {
  const t = useTranslations('CTA');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (mounted && isAuthenticated) return null;

  return (
    <div className="flex flex-1 justify-center px-5 py-5 md:px-20 xl:px-40">
      <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
        <div className="@container">
          <div className="border-border to-primary/5 mt-10 flex flex-col items-center justify-center gap-8 rounded-3xl border bg-gradient-to-b from-transparent px-4 py-20 text-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-foreground max-w-[720px] text-3xl leading-tight font-black tracking-tight md:text-5xl">
                {t('title')}
              </h1>
              <p className="text-muted-foreground mx-auto max-w-[600px] text-lg leading-relaxed font-normal">
                {t('text')}
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
              <Link href={`/${locale}/register`} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="h-12 w-full min-w-[200px] px-6 text-base shadow-lg shadow-blue-500/20 sm:w-auto"
                >
                  {tCommon('create_profile')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
