'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/atoms/Slider';
import { Dropdown } from '@/components/atoms/Dropdown';
import { DependencyBadge } from '@/components/atoms/DependencyBadge';
import { Button } from '@/components/atoms/Button';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';
import { useAxisInteraction } from '@/hooks/features/atlas/useAxisInteraction';

interface AxisCardProps {
  id?: string;
  axis: IdeologyAxis;
  onSave?: (uuid: string, data: AnswerUpdatePayload) => void;
  onDelete?: (uuid: string) => void;
  answerData?: AnswerData;
  otherAnswerData?: AnswerData;
  affinity?: number;
  viewerUsername?: string;
  targetUsername?: string;
  hasTargetUser?: boolean;
  dependencyNames: string[];
  readOnly?: boolean;
  variant?: 'default' | 'other';
  customHexColor?: string;
  otherCustomColor?: string;
}

export function AxisCard({
  id,
  axis,
  onSave,
  onDelete,
  answerData,
  otherAnswerData,
  affinity,
  viewerUsername,
  targetUsername,
  hasTargetUser = false,
  dependencyNames,
  readOnly = false,
  variant = 'default',
  customHexColor,
  otherCustomColor,
}: AxisCardProps) {
  const t = useTranslations('Atlas');
  const tCommon = useTranslations('Common');
  const [showDescription, setShowDescription] = useState(false);

  const effectiveHasTarget = hasTargetUser || !!targetUsername;
  const isComparisonView = effectiveHasTarget;

  const sliderUserAnswer = answerData;
  const sliderOtherAnswer = otherAnswerData;

  const { state, actions } = useAxisInteraction({
    axisUuid: axis.uuid,
    answerData: sliderUserAnswer,
    onSave,
    onDelete,
    readOnly,
  });

  const { value, marginLeft, marginRight, isIndifferent, isDropdownOpen } = state;

  const isOther = variant === 'other';

  const meHasAnswer = sliderUserAnswer && (sliderUserAnswer.value !== null || sliderUserAnswer.is_indifferent);
  const themHasAnswer = sliderOtherAnswer && (sliderOtherAnswer.value !== null || sliderOtherAnswer.is_indifferent);
  const themIsIndifferent = sliderOtherAnswer?.is_indifferent ?? false;

  const themIsNotAnswered = !themHasAnswer;

  const showThemAsNotAnswered = isComparisonView && themIsNotAnswered;

  const canCopy = meHasAnswer && (themHasAnswer || themIsIndifferent);

  const marginOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const isSymmetric = marginLeft === marginRight;
  const marginDisplayValue = isSymmetric ? marginLeft : t('asymmetric_label');

  const activeBorderClass = isOther ? 'border-other-user' : 'border-primary';
  const activeBgClass = isOther ? 'bg-other-user/5' : 'bg-primary/5';
  const activeTitleClass = isOther ? 'text-other-user' : 'text-primary';

  const cardStyle = isComparisonView
    ? 'bg-card border-border'
    : meHasAnswer && !isIndifferent
      ? `${activeBorderClass} ${activeBgClass}`
      : 'bg-card border-border';

  const customStyle =
    customHexColor && meHasAnswer && !isIndifferent
      ? { borderColor: customHexColor, backgroundColor: `${customHexColor}0D` }
      : undefined;

  const affinityStyle = affinity !== undefined && !themIsNotAnswered ? getAffinityBadgeStyles(affinity) : null;

  const sliderBottomLabel = viewerUsername ? `@${viewerUsername}` : t('your_answer_label');

  const sliderTopLabel = targetUsername
    ? targetUsername.startsWith('@')
      ? targetUsername
      : `@${targetUsername}`
    : t('their_answer_label');

  const isTarget = id === 'atlas-first-axis';

  return (
    <div
      id={id}
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300',
        !readOnly && 'hover:shadow-md',
        !customHexColor && cardStyle,
        isIndifferent && !sliderOtherAnswer && !effectiveHasTarget ? 'opacity-75' : '',
        isDropdownOpen || showDescription ? 'z-50' : 'z-0',
      )}
      style={customStyle}
    >
      <DependencyBadge names={dependencyNames} variant={variant} />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-1">
          <div className="relative flex w-full flex-col">
            <div className="flex items-center gap-2">
              <h4
                id={isTarget ? 'atlas-axis-title' : undefined}
                className={clsx(
                  'text-lg font-bold',
                  !customHexColor &&
                    (!sliderOtherAnswer && meHasAnswer && !isIndifferent ? activeTitleClass : 'text-foreground'),
                )}
                style={
                  customHexColor && !sliderOtherAnswer && meHasAnswer && !isIndifferent
                    ? { color: customHexColor }
                    : undefined
                }
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
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
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
                          className={clsx(
                            'fixed top-1/2 left-1/2 z-[101] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 cursor-default md:absolute md:top-full md:left-0 md:z-50 md:mt-2 md:w-[400px] md:translate-x-0 md:translate-y-0',
                            'max-h-[50vh] overflow-y-auto rounded-xl shadow-2xl md:max-h-none md:overflow-visible',
                          )}
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="bg-popover text-popover-foreground border-border relative flex flex-col rounded-xl border p-5 shadow-2xl md:p-4 md:shadow-xl">
                            <div className="bg-popover border-t-border border-l-border absolute -top-1.5 left-2 hidden h-3 w-3 rotate-45 border-t border-l md:block" />
                            <div className="mb-3 flex shrink-0 items-center justify-between md:hidden">
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
                            <div>
                              <p className="text-base leading-relaxed font-normal whitespace-pre-line md:text-sm">
                                {axis.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {isComparisonView && affinityStyle && (
              <div className="mt-2 flex items-center gap-3">
                {!readOnly && canCopy && sliderOtherAnswer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.handleCopyFromOther(sliderOtherAnswer)}
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

        {!sliderOtherAnswer && meHasAnswer && (
          <div className="flex w-full shrink-0 items-center justify-end gap-2 md:w-auto md:justify-start">
            <button
              onClick={actions.handleReset}
              title={t('reset_label')}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
            {!isIndifferent && !readOnly && (
              <div className="relative z-20 min-w-[120px]">
                <Dropdown<number | string>
                  value={marginDisplayValue}
                  options={marginOptions}
                  onChange={val => actions.handleDropdownChange(val as number)}
                  label={t('margin_label')}
                  align="end"
                  onOpenChange={actions.setIsDropdownOpen}
                  variant="default"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {!readOnly && (
        <div id={isTarget ? 'atlas-axis-indifferent' : undefined} className="flex items-center gap-2">
          <button
            onClick={actions.toggleIndifferent}
            disabled={readOnly}
            className={clsx(
              'flex h-5 w-5 items-center justify-center rounded border transition-colors',
              isIndifferent
                ? 'bg-primary border-primary'
                : 'border-muted-foreground hover:border-foreground bg-transparent',
              readOnly && 'cursor-default opacity-50',
            )}
            style={
              isIndifferent && customHexColor
                ? { backgroundColor: customHexColor, borderColor: customHexColor }
                : undefined
            }
          >
            {isIndifferent && (
              <span className="material-symbols-outlined text-primary-foreground text-[16px] font-bold">check</span>
            )}
          </button>
          <button
            onClick={actions.toggleIndifferent}
            disabled={readOnly}
            className={clsx('text-muted-foreground text-sm transition-colors', !readOnly && 'hover:text-foreground')}
          >
            {t('indifferent_label')}
          </button>
        </div>
      )}

      <div
        id={isTarget ? 'atlas-axis-slider' : undefined}
        className={clsx(
          'relative z-10 px-2 pb-2 transition-opacity duration-300',
          isIndifferent && !sliderOtherAnswer ? 'opacity-75' : '',
        )}
      >
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={value}
          marginLeft={marginLeft}
          marginRight={marginRight}
          bottomLabel={sliderBottomLabel}
          isIndifferent={isIndifferent}
          indifferentLabel={t('indifferent_status')}
          isNotAnswered={readOnly && !meHasAnswer}
          notAnsweredLabel={t('not_answered_status')}
          otherValue={sliderOtherAnswer?.value ?? undefined}
          otherMarginLeft={sliderOtherAnswer?.margin_left ?? undefined}
          otherMarginRight={sliderOtherAnswer?.margin_right ?? undefined}
          otherIsIndifferent={themIsIndifferent}
          otherIsNotAnswered={showThemAsNotAnswered}
          otherNotAnsweredLabel={t('not_answered_status')}
          otherIndifferentLabel={t('indifferent_status')}
          topLabel={sliderTopLabel}
          onChange={actions.handleSliderChange}
          onCommit={actions.handleCommit}
          onThumbWheel={actions.handleThumbWheel}
          readOnly={readOnly}
          variant={variant}
          customHexColor={customHexColor}
          otherCustomColor={otherCustomColor}
        />
      </div>
    </div>
  );
}
