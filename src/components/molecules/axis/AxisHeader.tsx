'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Portal } from '@/components/atoms/Portal';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData } from '@/store/useAtlasStore';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';

interface AxisHeaderProps {
  axis: IdeologyAxis;
  isTarget: boolean;
  activeTitleClass: string;
  customHexColor?: string;
  hasAnswer: boolean;
  isIndifferent: boolean;
  isComparisonView: boolean;
  affinity?: number;
  sliderOtherAnswer?: AnswerData;
  canCopy: boolean;
  onCopy: () => void;
  readOnly: boolean;
}

export function AxisHeader({
  axis,
  isTarget,
  activeTitleClass,
  customHexColor,
  hasAnswer,
  isIndifferent,
  isComparisonView,
  affinity,
  sliderOtherAnswer,
  canCopy,
  onCopy,
}: AxisHeaderProps) {
  const t = useTranslations('Atlas');
  const tCommon = useTranslations('Common');
  const [showDescription, setShowDescription] = useState(false);

  const affinityStyle = affinity !== undefined ? getAffinityBadgeStyles(affinity) : null;
  const isColored = !customHexColor && !sliderOtherAnswer && hasAnswer && !isIndifferent;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative flex w-full flex-col">
        <div className="flex items-center gap-2">
          <h4
            id={isTarget ? 'atlas-axis-title' : undefined}
            className={clsx('text-lg font-bold', isColored ? activeTitleClass : 'text-foreground')}
            style={customHexColor && isColored ? { color: customHexColor } : undefined}
          >
            {axis.name}
          </h4>

          {axis.description && (
            <div
              id={isTarget ? 'atlas-axis-help' : undefined}
              className="relative z-20"
              onMouseEnter={() => setShowDescription(true)}
              onMouseLeave={() => setShowDescription(false)}
            >
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-current text-[10px] font-bold transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  setShowDescription(!showDescription);
                }}
              >
                ?
              </button>

              <AnimatePresence>
                {showDescription && (
                  <>
                    <Portal>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={e => {
                          e.stopPropagation();
                          setShowDescription(false);
                        }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-popover text-popover-foreground border-border fixed top-1/2 left-1/2 z-[9999] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 cursor-default rounded-xl border p-5 shadow-2xl md:hidden"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="mb-3 flex shrink-0 items-center justify-between">
                          <span className="text-sm font-bold tracking-wider uppercase">{tCommon('info')}</span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setShowDescription(false);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                        <p className="text-base leading-relaxed font-normal whitespace-pre-line">{axis.description}</p>
                      </motion.div>
                    </Portal>

                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="bg-popover text-popover-foreground border-border absolute bottom-full left-1/2 z-50 mb-2 hidden w-80 -translate-x-1/2 cursor-default rounded-xl border p-4 shadow-xl md:block"
                      onClick={e => e.stopPropagation()}
                    >
                      <p className="text-xs leading-relaxed font-normal whitespace-pre-line">{axis.description}</p>
                      <div className="bg-popover border-r-border border-b-border absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b"></div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {isComparisonView && affinityStyle && (
          <div className="mt-2 flex items-center gap-3">
            {canCopy && sliderOtherAnswer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="text-muted-foreground hover:text-primary hover:border-border hover:bg-secondary h-7 gap-1.5 border border-transparent px-2 text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                {t('copy_answer_label')}
              </Button>
            )}
            <div
              className={clsx(
                'flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-wide uppercase',
                affinityStyle.badgeClass,
              )}
            >
              <span className="material-symbols-outlined text-[14px]">{affinityStyle.icon}</span>
              {t(affinityStyle.labelKey)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
