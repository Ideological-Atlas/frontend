'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import { AxisCard } from '@/components/molecules/AxisCard';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';
import { useAuthStore } from '@/store/useAuthStore';

interface AxisListProps {
  axes: IdeologyAxis[];
  answers: Record<string, AnswerData>;
  axisAffinityMap?: Record<string, { affinity: number; my_answer: AnswerData | null }>;
  targetUsername?: string;
  onSaveAnswer?: (uuid: string, data: AnswerUpdatePayload) => void;
  onDeleteAnswer?: (uuid: string) => void;
  isLoading: boolean;
  isLevelLoading: boolean;
  readOnly?: boolean;
  variant?: 'default' | 'other';
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

export function AxisList({
  axes,
  answers,
  axisAffinityMap,
  targetUsername,
  onSaveAnswer,
  onDeleteAnswer,
  isLoading,
  isLevelLoading,
  readOnly = false,
  variant = 'default',
}: AxisListProps) {
  const t = useTranslations('Atlas');
  const { user } = useAuthStore();
  const viewerUsername = user?.username;

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
    <motion.div layout className="flex flex-col gap-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {axes.map(axis => {
          const names = axis.condition_rules.map(rule => {
            return rule.conditioner?.name || 'Unknown';
          });

          const currentViewAnswers = answers[axis.uuid];

          let primaryAnswer: AnswerData | undefined;
          let secondaryAnswer: AnswerData | undefined;
          let effectiveVariant = variant;
          let affinityValue = undefined;

          const isComparisonMode = !!axisAffinityMap && !readOnly;

          if (isComparisonMode) {
            const comparisonData = axisAffinityMap![axis.uuid];

            primaryAnswer = comparisonData?.my_answer || undefined;

            secondaryAnswer = currentViewAnswers;

            effectiveVariant = 'default'; // Yo soy el protagonista de la acción
            affinityValue = comparisonData?.affinity;
          } else {
            primaryAnswer = currentViewAnswers;

            secondaryAnswer = undefined;
            effectiveVariant = variant;
            affinityValue = undefined;
          }

          return (
            <motion.div key={axis.uuid} layout variants={itemVariants} initial="hidden" animate="visible" exit="exit">
              <AxisCard
                axis={axis}
                onSave={onSaveAnswer}
                onDelete={onDeleteAnswer}
                answerData={primaryAnswer}
                otherAnswerData={secondaryAnswer}
                affinity={affinityValue}
                viewerUsername={viewerUsername}
                targetUsername={targetUsername}
                dependencyNames={names}
                readOnly={readOnly}
                variant={effectiveVariant}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
