'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

import { AuthService } from '@/lib/client/services/AuthService';
import { ApiError } from '@/lib/client/core/ApiError';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';

type VerifyState = 'loading' | 'success' | 'already_verified' | 'error';

export function VerifyStatus() {
  const t = useTranslations('Verify');
  const locale = useLocale();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();

  const [status, setStatus] = useState<VerifyState>('loading');

  const triggerConfetti = () => {
    const style = getComputedStyle(document.documentElement);
    const getHex = (prop: string) => style.getPropertyValue(prop).trim();
    const colors = [
      getHex('--primary'),
      getHex('--accent'),
      getHex('--secondary'),
      getHex('--destructive'),
      getHex('--strong-accent'),
    ].filter(color => color.startsWith('#'));

    const end = Date.now() + 3 * 1000;
    const frame = () => {
      confetti({
        particleCount: colors.length,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: colors.length > 0 ? colors : undefined,
        ticks: 300,
        gravity: 1.2,
        scalar: 1.2,
      });
      confetti({
        particleCount: colors.length,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: colors.length > 0 ? colors : undefined,
        ticks: 300,
        gravity: 1.2,
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    const verifyUser = async () => {
      const uuid = params.uuid as string;
      if (!uuid) {
        setStatus('error');
        return;
      }
      try {
        await AuthService.usersVerifyPartialUpdate(uuid, { is_verified: true });
        setStatus('success');
        triggerConfetti();
      } catch (error) {
        setStatus(error instanceof ApiError && error.status === 403 ? 'already_verified' : 'error');
      }
    };
    verifyUser();
  }, [params.uuid]);

  const stateConfig = {
    loading: {
      icon: 'sync',
      iconColor: 'text-primary animate-spin',
      bgGradient: 'from-primary/20',
      title: t('title_loading'),
      description: t('description_loading'),
    },
    success: {
      icon: 'check_circle',
      iconColor: 'text-green-500',
      bgGradient: 'from-green-500/20',
      title: t('title_success'),
      description: t('description_success'),
    },
    already_verified: {
      icon: 'verified',
      iconColor: 'text-primary',
      bgGradient: 'from-primary/20',
      title: t('title_already_verified'),
      description: t('description_already_verified'),
    },
    error: {
      icon: 'error',
      iconColor: 'text-destructive',
      bgGradient: 'from-destructive/20',
      title: t('title_error'),
      description: t('description_error'),
    },
  };

  const currentConfig = stateConfig[status];

  return (
    <AuthCard maxWidth="max-w-[420px]" className="relative overflow-hidden">
      <div
        className={clsx(
          'pointer-events-none absolute top-0 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b opacity-20 blur-[60px] transition-colors duration-500',
          currentConfig.bgGradient,
        )}
      />
      <div className="relative flex flex-col items-center text-center">
        <motion.div
          variants={itemVariants}
          className="bg-card/50 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm backdrop-blur-sm"
        >
          <span className={clsx('material-symbols-outlined text-[32px]', currentConfig.iconColor)}>
            {currentConfig.icon}
          </span>
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-foreground text-2xl font-bold tracking-tight">
          {currentConfig.title}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground mt-3 mb-8 text-sm leading-relaxed">
          {currentConfig.description}
        </motion.p>
        {status !== 'loading' && (
          <motion.div variants={itemVariants} className="w-full">
            <Link href={`/${locale}${isAuthenticated ? '/' : '/login'}`} className="w-full">
              <Button className="w-full" variant="primary">
                {isAuthenticated ? t('go_to_dashboard') : t('go_to_login')}
                <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </AuthCard>
  );
}
