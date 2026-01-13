'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import { AxisCard } from '@/components/molecules/AxisCard';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';

interface AxisListProps {
  axes: IdeologyAxis[];
  answers: Record<string, AnswerData>;
  sectionId: string | null;
  onSaveAnswer: (uuid: string, data: AnswerUpdatePayload) => void;
  isLoading: boolean;
  isLevelLoading: boolean;
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

export function AxisList({ axes, answers, sectionId, onSaveAnswer, isLoading, isLevelLoading }: AxisListProps) {
  const t = useTranslations('Atlas');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!isLevelLoading && axes.length === 0) {
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
          key={sectionId}
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid gap-6"
        >
          {axes.map(axis => (
            <motion.div key={axis.uuid} variants={itemVariants}>
              <AxisCard axis={axis} onSave={onSaveAnswer} answerData={answers[axis.uuid]} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
