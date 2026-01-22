'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ConditionerCard } from '@/components/molecules/ConditionerCard';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';

interface ConditionerListProps {
  conditioners: IdeologyConditioner[];
  answers: Record<string, string>;
  otherAnswers?: Record<string, string>;
  onSaveAnswer?: (uuid: string, value: string) => void;
  onResetAnswer?: (uuid: string) => void;
  isLoading: boolean;
  dependencyNameMap: Record<string, string>;
  readOnly?: boolean;
  variant?: 'default' | 'other';
  targetUsername?: string;
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

export function ConditionerList({
  conditioners,
  answers,
  otherAnswers,
  onSaveAnswer,
  onResetAnswer,
  isLoading,
  dependencyNameMap,
  readOnly = false,
  variant = 'default',
  targetUsername,
}: ConditionerListProps) {
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
        {conditioners.map(cond => {
          let rules = [];
          try {
            if (typeof cond.condition_rules === 'string') {
              rules = JSON.parse(cond.condition_rules);
            } else if (Array.isArray(cond.condition_rules)) {
              rules = cond.condition_rules;
            }
          } catch (e) {
            console.error('Error parsing conditioner rules', e);
          }

          // @ts-expect-error - Rules are typed locally inside the loop logic
          const names = rules.map(rule => {
            const targetUuid = rule.source_conditioner_uuid || rule.conditioner?.uuid;

            if (targetUuid) {
              if (dependencyNameMap[targetUuid]) return dependencyNameMap[targetUuid];
              const normUuid = targetUuid.replace(/-/g, '');
              if (dependencyNameMap[normUuid]) return dependencyNameMap[normUuid];
            }

            if (rule.conditioner?.name) return rule.conditioner.name;

            return 'Unknown';
          });

          return (
            <motion.div key={cond.uuid} layout variants={itemVariants} initial="hidden" animate="visible" exit="exit">
              <ConditionerCard
                conditioner={cond}
                onSave={onSaveAnswer}
                onReset={onResetAnswer}
                answer={answers[cond.uuid]}
                otherAnswer={otherAnswers ? otherAnswers[cond.uuid] : undefined}
                targetUsername={targetUsername}
                dependencyNames={names}
                readOnly={readOnly}
                variant={variant}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
