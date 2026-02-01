'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { Link } from '@/components/atoms/SmartLink';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';

interface DiscoveryCardProps {
  ideology: IdeologyList;
  affinity?: number;
  isLoading: boolean;
}

export function DiscoveryCard({ ideology, affinity, isLoading }: DiscoveryCardProps) {
  const t = useTranslations('Atlas');
  const bgColor = ideology.color || '#64748b';
  const percentage = affinity ?? 0;

  const styles = getAffinityBadgeStyles(percentage);
  const bgClass = styles.colorClass.replace('text-', 'bg-');

  return (
    <Link href={`/encyclopedia/${ideology.uuid}/definitions`} className="block w-full">
      <motion.div
        layout
        transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-card border-border hover:border-primary/50 group relative flex w-full overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-zinc-950 md:h-auto md:w-32">
          <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundColor: bgColor }} />
          {ideology.flag ? (
            <Image
              src={ideology.flag}
              alt={ideology.name}
              fill
              className="object-cover opacity-80 mix-blend-overlay transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white/40">flag</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3 p-4 md:flex-row md:items-center md:gap-6 md:p-6">
          <div className="flex-1">
            <h3 className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
              {ideology.name}
            </h3>
            <p className="text-muted-foreground line-clamp-1 text-sm whitespace-pre-line md:line-clamp-2">
              {ideology.description_neutral || ideology.description_supporter}
            </p>
          </div>

          <div className="flex w-full flex-col gap-1 md:w-48">
            <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
              <span className="text-muted-foreground">{t('affinity_score')}</span>
              <span className={clsx(isLoading ? 'text-muted-foreground animate-pulse' : styles.colorClass)}>
                {isLoading ? t('affinity_pending') : `${Math.round(percentage)}%`}
              </span>
            </div>
            <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
              {!isLoading && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={clsx('h-full rounded-full', bgClass)}
                />
              )}
            </div>
          </div>

          <div className="hidden shrink-0 md:block">
            <div className="bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
