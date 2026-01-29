'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { WavyBackground } from '@/components/atoms/WavyBackground';
import { useTranslations } from 'next-intl';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description: string;
  affinity?: number | null;
  variant?: 'default' | 'other';
}

export function PageHeader({ title, description, affinity, variant = 'default' }: PageHeaderProps) {
  const t = useTranslations('Atlas');
  const [isExpanded, setIsExpanded] = useState(false);

  const affinityStyle = affinity !== undefined && affinity !== null ? getAffinityBadgeStyles(affinity) : null;

  return (
    <section
      id="atlas-header-content"
      className="border-border bg-card relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-6 text-center shadow-sm md:p-8"
    >
      <WavyBackground variant={variant} />
      <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">{title}</h1>

          {affinityStyle && affinity !== null && affinity !== undefined && (
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  'rounded-full px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur-sm transition-transform hover:scale-105',
                  affinityStyle.solidClass,
                )}
              >
                {Math.round(affinity)}% {t('affinity_short_label') || 'Afinidad'}
              </div>

              <span className={clsx('text-sm font-black tracking-widest uppercase', affinityStyle.colorClass)}>
                {t(affinityStyle.labelKey)}
              </span>
            </div>
          )}
        </div>

        <motion.div layout className="w-full overflow-hidden">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <p className="text-muted-foreground mx-auto max-w-[600px] text-base leading-relaxed">{description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <button
          id="atlas-header-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:bg-background/50 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
          aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-[24px]"
          >
            expand_more
          </motion.span>
        </button>
      </div>
    </section>
  );
}
