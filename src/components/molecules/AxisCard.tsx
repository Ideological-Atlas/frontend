'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Slider } from '@/components/atoms/Slider';
import { Dropdown } from '@/components/atoms/Dropdown';
import { DependencyBadge } from '@/components/atoms/DependencyBadge';
import { Button } from '@/components/atoms/Button';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';

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
}

const getInitialMargin = (m: number | null | undefined, isMobile: boolean) => {
  if (m !== undefined && m !== null) return m;
  return isMobile ? 35 : 25;
};

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
}: AxisCardProps) {
  const t = useTranslations('Atlas');
  const tCommon = useTranslations('Common');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [value, setValue] = useState(answerData?.value ?? 0);
  const [marginLeft, setMarginLeft] = useState(answerData?.margin_left ?? 10);
  const [marginRight, setMarginRight] = useState(answerData?.margin_right ?? 10);
  const [isIndifferent, setIsIndifferent] = useState(answerData?.is_indifferent ?? false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const nextValue = answerData?.value ?? 0;
    const nextML = getInitialMargin(answerData?.margin_left, isMobile);
    const nextMR = getInitialMargin(answerData?.margin_right, isMobile);
    const nextIndifferent = answerData?.is_indifferent ?? false;

    // Sincronización segura: solo actualiza si cambia.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(prev => (prev !== nextValue ? nextValue : prev));

    setMarginLeft(prev => (prev !== nextML ? nextML : prev));

    setMarginRight(prev => (prev !== nextMR ? nextMR : prev));

    setIsIndifferent(prev => (prev !== nextIndifferent ? nextIndifferent : prev));
  }, [answerData?.value, answerData?.margin_left, answerData?.margin_right, answerData?.is_indifferent]);

  const isOther = variant === 'other';

  const effectiveHasTarget = hasTargetUser || !!targetUsername;

  const isAnonymousView = effectiveHasTarget && !viewerUsername;
  const isComparisonView = effectiveHasTarget && !!viewerUsername;

  const meHasAnswer = answerData && (answerData.value !== null || answerData.is_indifferent);

  const themHasAnswer = otherAnswerData && (otherAnswerData.value !== null || otherAnswerData.is_indifferent);
  const themIsIndifferent = otherAnswerData?.is_indifferent ?? false;
  const themIsNotAnswered = !themHasAnswer;

  const showThemAsNotAnswered = (isComparisonView || isAnonymousView) && themIsNotAnswered;

  const canCopy = meHasAnswer && (themHasAnswer || themIsIndifferent);

  const handleSliderChange = (updates: { value?: number; marginLeft?: number; marginRight?: number }) => {
    if (readOnly || isIndifferent) return;
    if (updates.value !== undefined) setValue(updates.value);
    if (updates.marginLeft !== undefined) setMarginLeft(updates.marginLeft);
    if (updates.marginRight !== undefined) setMarginRight(updates.marginRight);
  };

  const handleCommit = () => {
    if (readOnly || isIndifferent || !onSave) return;
    onSave(axis.uuid, { value, margin_left: marginLeft, margin_right: marginRight, is_indifferent: false });
  };

  const handleDropdownChange = (targetMargin: number) => {
    if (readOnly || !onSave) return;
    const maxMarginLeft = value + 100;
    const maxMarginRight = 100 - value;
    const safeMargin = Math.min(targetMargin, maxMarginLeft, maxMarginRight);
    setMarginLeft(safeMargin);
    setMarginRight(safeMargin);
    onSave(axis.uuid, { value, margin_left: safeMargin, margin_right: safeMargin, is_indifferent: false });
  };

  const handleThumbWheel = (delta: number) => {
    if (readOnly || isIndifferent || !onSave) return;
    let newMl = marginLeft + delta;
    let newMr = marginRight + delta;
    if (newMl < 0) newMl = 0;
    if (newMr < 0) newMr = 0;
    const maxMl = value + 100;
    const maxMr = 100 - value;
    if (newMl > maxMl) newMl = maxMl;
    if (newMr > maxMr) newMr = maxMr;
    setMarginLeft(newMl);
    setMarginRight(newMr);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSave(axis.uuid, { value, margin_left: newMl, margin_right: newMr, is_indifferent: false });
    }, 500);
  };

  const toggleIndifferent = () => {
    if (readOnly) return;
    const newIndifferentState = !isIndifferent;
    setIsIndifferent(newIndifferentState);

    if (newIndifferentState) {
      if (onSave) {
        setValue(0);
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const defaultM = isMobile ? 35 : 25;
        setMarginLeft(defaultM);
        setMarginRight(defaultM);
        onSave(axis.uuid, { is_indifferent: true, value: null, margin_left: null, margin_right: null });
      }
    } else {
      if (onDelete) {
        onDelete(axis.uuid);
      }
    }
  };

  const handleCopy = () => {
    if (!otherAnswerData || !onSave || themIsNotAnswered) return;
    const newData = {
      value: otherAnswerData.value,
      margin_left: otherAnswerData.margin_left,
      margin_right: otherAnswerData.margin_right,
      is_indifferent: otherAnswerData.is_indifferent,
    };
    if (newData.is_indifferent) {
      setIsIndifferent(true);
    } else {
      setIsIndifferent(false);
      setValue(newData.value ?? 0);
      setMarginLeft(newData.margin_left ?? 10);
      setMarginRight(newData.margin_right ?? 10);
    }
    onSave(axis.uuid, newData);
  };

  const handleReset = () => {
    if (readOnly || !onDelete) return;
    onDelete(axis.uuid);
  };

  const marginOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const isSymmetric = marginLeft === marginRight;
  const marginDisplayValue = isSymmetric ? marginLeft : t('asymmetric_label');

  const activeBorderClass = isOther ? 'border-other-user' : 'border-primary';
  const activeBgClass = isOther ? 'bg-other-user/5' : 'bg-primary/5';
  const activeTitleClass = isOther ? 'text-other-user' : 'text-primary';

  const cardStyle =
    isComparisonView || isAnonymousView
      ? 'bg-card border-border'
      : meHasAnswer && !isIndifferent
        ? `${activeBorderClass} ${activeBgClass}`
        : 'bg-card border-border';

  const affinityStyle = affinity !== undefined && !themIsNotAnswered ? getAffinityBadgeStyles(affinity) : null;

  const sliderBottomLabel = isAnonymousView
    ? undefined
    : viewerUsername
      ? `@${viewerUsername}`
      : t('your_answer_label');

  const sliderTopLabel = targetUsername ? `@${targetUsername}` : t('their_answer_label');

  const isTarget = id === 'atlas-first-axis';

  return (
    <div
      id={id}
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300',
        !readOnly && 'hover:shadow-md',
        cardStyle,
        isIndifferent && !otherAnswerData && !isAnonymousView ? 'opacity-75' : '',
        isDropdownOpen || showDescription ? 'z-50' : 'z-0',
      )}
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
                  !otherAnswerData && meHasAnswer && !isIndifferent ? activeTitleClass : 'text-foreground',
                )}
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
                              <p className="text-base leading-relaxed font-normal md:text-sm">{axis.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {!isAnonymousView && isComparisonView && affinityStyle && (
              <div className="mt-2 flex items-center gap-3">
                {!readOnly && canCopy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
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

        {!otherAnswerData && meHasAnswer && !isAnonymousView && (
          <div className="flex w-full shrink-0 items-center justify-end gap-2 md:w-auto md:justify-start">
            <button
              onClick={handleReset}
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
                  onChange={val => handleDropdownChange(val as number)}
                  label={t('margin_label')}
                  align="end"
                  onOpenChange={setIsDropdownOpen}
                  variant="default"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {!readOnly && !isAnonymousView && (
        <div id={isTarget ? 'atlas-axis-indifferent' : undefined} className="flex items-center gap-2">
          <button
            onClick={toggleIndifferent}
            disabled={readOnly}
            className={clsx(
              'flex h-5 w-5 items-center justify-center rounded border transition-colors',
              isIndifferent
                ? 'bg-primary border-primary'
                : 'border-muted-foreground hover:border-foreground bg-transparent',
              readOnly && 'cursor-default opacity-50',
            )}
          >
            {isIndifferent && (
              <span className={clsx('material-symbols-outlined text-primary-foreground text-[16px] font-bold')}>
                check
              </span>
            )}
          </button>
          <button
            onClick={toggleIndifferent}
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
          isIndifferent && !otherAnswerData && !isAnonymousView ? 'opacity-75' : '',
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
          isNotAnswered={false}
          notAnsweredLabel={t('not_answered_status')}
          otherValue={otherAnswerData?.value ?? undefined}
          otherMarginLeft={otherAnswerData?.margin_left ?? undefined}
          otherMarginRight={otherAnswerData?.margin_right ?? undefined}
          otherIsIndifferent={themIsIndifferent}
          otherIsNotAnswered={showThemAsNotAnswered}
          otherNotAnsweredLabel={t('not_answered_status')}
          otherIndifferentLabel={t('indifferent_status')}
          topLabel={sliderTopLabel}
          onChange={handleSliderChange}
          onCommit={handleCommit}
          onThumbWheel={handleThumbWheel}
          readOnly={readOnly}
          variant={isAnonymousView ? 'other' : variant}
          primaryOverlay={
            isAnonymousView ? (
              <Link href="/login" className="z-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-primary/10 hover:bg-primary/20 text-primary gap-2 shadow-sm backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                  {t('sign_in_to_compare')}
                </Button>
              </Link>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}
