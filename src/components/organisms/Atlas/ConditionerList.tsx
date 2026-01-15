'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ConditionerCard } from '@/components/molecules/ConditionerCard';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';

interface ConditionerListProps {
  conditioners: IdeologyConditioner[];
  answers: Record<string, string>;
  onSaveAnswer: (uuid: string, value: string) => void;
  isLoading: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export function ConditionerList({ conditioners, answers, onSaveAnswer, isLoading }: ConditionerListProps) {
  const t = useTranslations('Atlas');

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (conditioners.length === 0) {
    return (
      <div className="border-border bg-secondary/20 flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground">{t('no_questions')}</p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid gap-6 md:grid-cols-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {conditioners.map(cond => (
          <motion.div key={cond.uuid} layout variants={itemVariants} initial="hidden" animate="visible" exit="exit">
            <ConditionerCard conditioner={cond} onSave={onSaveAnswer} answer={answers[cond.uuid]} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
