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

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ConditionerList({ conditioners, answers, onSaveAnswer, isLoading }: ConditionerListProps) {
  const t = useTranslations('Atlas');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
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
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid gap-6 md:grid-cols-2"
        >
          {conditioners.map(cond => (
            <motion.div key={cond.uuid} variants={itemVariants}>
              <ConditionerCard conditioner={cond} onSave={onSaveAnswer} answer={answers[cond.uuid]} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
