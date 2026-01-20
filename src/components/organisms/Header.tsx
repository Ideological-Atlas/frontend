'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '../atoms/Button';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();

  const { isAuthenticated, logout, user } = useAuthStore();
  const resetAtlas = useAtlasStore(state => state.reset);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    resetAtlas();
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
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/atlas`}>
            <Button variant="primary" className="max-w-[480px]">
              {tCommon('get_started')}
            </Button>
          </Link>

          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="group relative z-50">
                <button className="flex items-center justify-center focus:outline-none">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: 'linear',
                      }}
                      className="absolute -inset-[2px] rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, var(--primary), var(--strong-accent), var(--primary))`,
                      }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: 'linear',
                      }}
                      className="absolute -inset-[2px] rounded-full opacity-50 blur-[1px]"
                      style={{
                        background: `conic-gradient(from 0deg, var(--primary), var(--strong-accent), var(--primary))`,
                      }}
                    />
                    <div className="bg-background relative z-10 flex h-full w-full items-center justify-center rounded-full p-[2px]">
                      <div className="bg-secondary text-foreground border-border flex h-full w-full items-center justify-center rounded-full border text-xs font-bold">
                        {user?.username ? user.username.slice(0, 2).toUpperCase() : '??'}
                      </div>
                    </div>
                  </div>
                </button>

                <div className="border-border bg-card invisible absolute top-full right-0 mt-4 w-48 translate-y-2 rounded-xl border p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex flex-col gap-1">
                    <Link href={`/${locale}/profile`}>
                      <div className="text-foreground hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        {tCommon('profile')}
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      {tCommon('logout')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
