'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import type { SimpleUser } from '@/lib/client/models/SimpleUser';
import { useAuthStore } from '@/store/useAuthStore';
import { clsx } from 'clsx';
import { getAffinityLevel } from '@/lib/affinity-utils';
import { useTheme } from 'next-themes';

interface ProfileHeaderProps {
  user: SimpleUser;
  affinity?: number | null;
  isPublic?: boolean;
}

function Counter({ value }: { value: MotionValue<number> }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const unsubscribe = value.on('change', latest => setDisplayValue(Math.round(latest)));
    return () => unsubscribe();
  }, [value]);
  return <span className="text-xs font-bold">{displayValue}%</span>;
}

const CSS_VARS = [
  '--affinity-opposite',
  '--affinity-very-low',
  '--affinity-low',
  '--affinity-compatible',
  '--affinity-high',
  '--affinity-very-high',
  '--affinity-almost-identical',
  '--affinity-identical',
];

export function ProfileHeader({ user, affinity, isPublic }: ProfileHeaderProps) {
  const t = useTranslations('Atlas');
  const { user: authUser } = useAuthStore();
  const { resolvedTheme } = useTheme();

  const isOwnProfile = authUser?.uuid === user.uuid;
  const initial = user.username ? user.username.substring(0, 2).toUpperCase() : '??';
  const displayBio = user.bio ? (user.bio.length > 255 ? user.bio.substring(0, 255) + '...' : user.bio) : null;

  const progress = useMotionValue(0);

  const [palette, setPalette] = useState<string[]>(Array(8).fill('rgba(0,0,0,0)'));

  useEffect(() => {
    const updatePalette = () => {
      const style = getComputedStyle(document.documentElement);
      const newColors = CSS_VARS.map(v => style.getPropertyValue(v).trim() || '#000000');

      setPalette(prev => {
        const hasChanged = newColors.some((c, i) => c !== prev[i]);
        return hasChanged ? newColors : prev;
      });
    };

    updatePalette();

    const timeout = setTimeout(updatePalette, 50);
    return () => clearTimeout(timeout);
  }, [resolvedTheme]);

  const color = useTransform(progress, [0, 15, 30, 45, 60, 80, 90, 100], palette);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(progress, value => circumference - (value / 100) * circumference);

  useEffect(() => {
    if (affinity !== undefined && affinity !== null) {
      const controls = animate(progress, affinity, { duration: 1.5, ease: 'easeOut' });
      return () => controls.stop();
    }
  }, [affinity, progress]);

  const affinityInfo = affinity !== null && affinity !== undefined ? getAffinityLevel(affinity) : null;

  return (
    <div className="bg-card border-border sticky top-20 z-30 mb-8 flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 shadow-md transition-all duration-300 md:flex-row md:items-center">
      <div className="flex items-center gap-6">
        <div className="relative flex shrink-0 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute -inset-[3px] rounded-full"
            style={{
              background: `conic-gradient(from 0deg, var(--other-user), var(--other-user-strong), var(--other-user))`,
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute -inset-[3px] rounded-full opacity-50 blur-sm"
            style={{
              background: `conic-gradient(from 0deg, var(--other-user), var(--other-user-strong), var(--other-user))`,
            }}
          />
          <div className="bg-card relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full p-[4px]">
            <div className="bg-other-user flex h-full w-full items-center justify-center rounded-full text-2xl font-black text-white shadow-inner">
              {initial}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-foreground truncate text-xl font-bold md:text-2xl">@{user.username}</h1>
          {isPublic && (
            <div className="flex flex-wrap gap-2">
              <div className="bg-primary/20 text-primary border-primary/20 flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                {t('public_profile_badge')}
              </div>
            </div>
          )}
          {displayBio && (
            <p className="text-muted-foreground max-w-[500px] text-sm leading-relaxed break-words">{displayBio}</p>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 md:block">
        {isOwnProfile ? (
          <div className="bg-primary/10 border-primary/20 flex items-center gap-4 rounded-xl border p-3 pr-5">
            <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {t('this_is_you_label')}
              </span>
              <span className="text-primary text-base font-black">{t('your_answers_label')}</span>
            </div>
          </div>
        ) : affinityInfo ? (
          <div className="bg-secondary/10 border-border flex items-center gap-4 rounded-xl border p-3 pr-5">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 48 48">
                <circle
                  className="text-secondary"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="24"
                  cy="24"
                />
                <motion.circle
                  style={{ stroke: color, strokeDashoffset }}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="24"
                  cy="24"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Counter value={progress} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {t('similarity_label')}
              </span>
              <span className={clsx('text-base font-black transition-colors duration-500', affinityInfo.colorClass)}>
                {t(affinityInfo.labelKey)}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-secondary/30 h-10 w-32 rounded-lg"></div>
        )}
      </div>
    </div>
  );
}
