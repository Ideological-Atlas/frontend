'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';

interface ContextGridProps {
  conditioners: IdeologyConditioner[];
  isLoading: boolean;
}

export function ContextGrid({ conditioners, isLoading }: ContextGridProps) {
  const t = useTranslations('Atlas');

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  if (conditioners.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border bg-card rounded-xl border p-6 shadow-sm"
    >
      <h3 className="text-foreground mb-4 text-lg font-bold">{t('context_configuration')}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conditioners.map(cond => (
          <div key={cond.uuid} className="flex flex-col gap-2">
            <label className="text-foreground text-sm font-medium">{cond.name}</label>
            <div className="border-border bg-secondary text-muted-foreground flex h-10 items-center justify-center rounded-lg border text-sm">
              {t('selector_placeholder', { type: cond.type ?? 'unknown' })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
