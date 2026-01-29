'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { useLocale } from 'next-intl';

export function useSmartRouter() {
  const router = useTransitionRouter();
  const locale = useLocale();

  const push = (href: string) => {
    const isHome = href === `/${locale}` || href === '/';

    if (isHome) {
      document.documentElement.classList.add('back-transition');
    } else {
      document.documentElement.classList.remove('back-transition');
    }

    router.push(href);
  };

  return { ...router, push };
}
