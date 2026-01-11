'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '../atoms/Button';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();

  const { isAuthenticated, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.refresh();
    router.replace(`/${locale}`);
  };

  const navKeys = ['home', 'features', 'explore', 'about'];

  return (
    <header className="bg-background border-border sticky top-0 z-50 flex items-center justify-between border-b border-solid px-10 py-4 whitespace-nowrap">
      <div className="text-foreground flex items-center gap-4">
        <Link href={`/${locale}`} className="relative flex size-8 items-center justify-center">
          <Image src="/logo.png" alt="Ideological Atlas Logo" width={32} height={32} className="object-contain" />
        </Link>
        <Link href={`/${locale}`} className="text-lg leading-tight font-bold tracking-[-0.015em]">
          {tCommon('ideological_atlas')}
        </Link>
      </div>
      <div className="flex hidden flex-1 justify-end gap-8 lg:flex">
        <div className="flex items-center gap-9">
          {navKeys.map(key => {
            const isActive = key === 'home';
            return (
              <Link
                key={key}
                className={clsx(
                  'text-sm leading-normal transition-colors',
                  isActive ? 'text-primary font-bold' : 'hover:text-primary text-muted-foreground font-medium',
                )}
                href={`/${locale}`}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/${mounted && isAuthenticated ? 'profile' : 'register'}`}>
            <Button variant="primary" className="max-w-[480px]">
              {tCommon('get_started')}
            </Button>
          </Link>

          {mounted && isAuthenticated ? (
            <Button variant="secondary" className="max-w-[480px]" onClick={handleLogout}>
              Dashboard
            </Button>
          ) : (
            <Link href={`/${locale}/login`}>
              <Button variant="secondary" className="max-w-[480px]">
                {tCommon('sign_in')}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="text-foreground flex items-center lg:hidden">
        <span className="material-symbols-outlined">menu</span>
      </div>
    </header>
  );
}
