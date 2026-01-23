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
  axis: IdeologyAxis;
  onSave?: (uuid: string, data: AnswerUpdatePayload) => void;
  onDelete?: (uuid: string) => void;
  answerData?: AnswerData;
  otherAnswerData?: AnswerData;
  affinity?: number;
  viewerUsername?: string;
  targetUsername?: string;
  dependencyNames: string[];
  readOnly?: boolean;
  variant?: 'default' | 'other';
}

const getInitialMargin = (m?: number | null) => (m !== undefined && m !== null ? m : 10);

export function AxisCard({
  axis,
  onSave,
  onDelete,
  answerData,
  otherAnswerData,
  affinity,
  viewerUsername,
  targetUsername,
  dependencyNames,
  readOnly = false,
  variant = 'default',
}: AxisCardProps) {
  const t = useTranslations('Atlas');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [value, setValue] = useState(answerData?.value ?? 0);
  const [marginLeft, setMarginLeft] = useState(getInitialMargin(answerData?.margin_left));
  const [marginRight, setMarginRight] = useState(getInitialMargin(answerData?.margin_right));
  const [isIndifferent, setIsIndifferent] = useState(answerData?.is_indifferent ?? false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(answerData?.value ?? 0);
    setMarginLeft(getInitialMargin(answerData?.margin_left));
    setMarginRight(getInitialMargin(answerData?.margin_right));
    setIsIndifferent(answerData?.is_indifferent ?? false);
  }, [answerData?.value, answerData?.margin_left, answerData?.margin_right, answerData?.is_indifferent]);

  const isAnswered = answerData !== undefined;
  const isOther = variant === 'other';

  const isAnonymousView = (isOther || otherAnswerData !== undefined) && !viewerUsername;

  const otherIsNotAnswered =
    isOther && (!otherAnswerData || (otherAnswerData.value === null && !otherAnswerData.is_indifferent));

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
        setMarginLeft(10);
        setMarginRight(10);
        onSave(axis.uuid, { is_indifferent: true, value: null, margin_left: null, margin_right: null });
      }
    } else {
      if (onDelete) {
        onDelete(axis.uuid);
      }
    }
  };

  const handleCopy = () => {
    if (!otherAnswerData || !onSave || otherIsNotAnswered) return;
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
    !isAnonymousView && (otherAnswerData !== undefined || isOther)
      ? 'bg-card border-border'
      : isAnswered && !isIndifferent
        ? `${activeBorderClass} ${activeBgClass}`
        : 'bg-card border-border';

  const affinityStyle = affinity !== undefined && !otherIsNotAnswered ? getAffinityBadgeStyles(affinity) : null;

  const sliderValue = isAnonymousView ? (otherAnswerData?.value ?? 0) : value;
  const sliderML = isAnonymousView ? getInitialMargin(otherAnswerData?.margin_left) : marginLeft;
  const sliderMR = isAnonymousView ? getInitialMargin(otherAnswerData?.margin_right) : marginRight;
  const sliderIndifferent = isAnonymousView ? (otherAnswerData?.is_indifferent ?? false) : isIndifferent;

  const sliderBottomLabel = isAnonymousView
    ? targetUsername
      ? `@${targetUsername}`
      : t('their_answer_label')
    : viewerUsername
      ? `@${viewerUsername}`
      : t('your_answer_label');

  const sliderOtherValue = isAnonymousView ? undefined : (otherAnswerData?.value ?? undefined);
  const sliderOtherML = isAnonymousView ? undefined : (otherAnswerData?.margin_left ?? undefined);
  const sliderOtherMR = isAnonymousView ? undefined : (otherAnswerData?.margin_right ?? undefined);
  const sliderOtherIndiff = isAnonymousView ? undefined : otherAnswerData?.is_indifferent;
  const sliderTopLabel = isAnonymousView ? undefined : targetUsername ? `@${targetUsername}` : t('their_answer_label');

  const effectiveVariant = isAnonymousView ? 'other' : variant;

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300',
        !readOnly && 'hover:shadow-md',
        cardStyle,
        sliderIndifferent && !otherAnswerData && !isAnonymousView ? 'opacity-75' : '',
        isDropdownOpen || showDescription ? 'z-50' : 'z-0',
      )}
    >
      <DependencyBadge names={dependencyNames} variant={variant} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex w-full flex-col gap-1">
          <div className="relative flex w-full flex-col">
            <div className="flex items-center gap-2">
              <h4
                className={clsx(
                  'text-lg font-bold',
                  !otherAnswerData && isAnswered && !isIndifferent ? activeTitleClass : 'text-foreground',
                )}
              >
                {axis.name}
              </h4>

              {axis.description && (
                <div
                  className="relative"
                  onMouseEnter={() => setShowDescription(true)}
                  onMouseLeave={() => setShowDescription(false)}
                >
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-current text-[10px] font-bold transition-colors"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    ?
                  </button>

                  <AnimatePresence>
                    {showDescription && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-0 z-50 mt-3 w-[calc(100vw-64px)] max-w-[400px] md:w-[400px]"
                      >
                        <div className="bg-popover text-popover-foreground border-border relative rounded-xl border p-4 shadow-xl">
                          <div className="bg-popover border-t-border border-l-border absolute -top-2 left-2 h-3 w-3 rotate-45 border-t border-l" />
                          <p className="text-sm leading-relaxed font-normal">{axis.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {!isAnonymousView && otherAnswerData && affinityStyle && (
              <div className="mt-2 flex items-center gap-3">
                {!readOnly && !otherIsNotAnswered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-primary hover:border-border hover:bg-secondary h-7 gap-1.5 border border-transparent px-2 text-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    {t('copy_answer_label') || 'Copiar'}
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

        {!otherAnswerData && isAnswered && !isAnonymousView && (
          <div className="flex shrink-0 items-center gap-2 pr-4 md:pr-0">
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
        <div className="flex items-center gap-2">
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
        className={clsx(
          'relative z-10 px-2 pb-2 transition-opacity duration-300',
          sliderIndifferent && !otherAnswerData && !isAnonymousView ? 'opacity-75' : '',
        )}
      >
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={sliderValue}
          marginLeft={sliderML}
          marginRight={sliderMR}
          bottomLabel={sliderBottomLabel}
          isIndifferent={sliderIndifferent}
          indifferentLabel={t('indifferent_status')}
          otherValue={sliderOtherValue}
          otherMarginLeft={sliderOtherML}
          otherMarginRight={sliderOtherMR}
          otherIsIndifferent={sliderOtherIndiff}
          otherIsNotAnswered={otherIsNotAnswered}
          otherNotAnsweredLabel={t('not_answered_status')}
          otherIndifferentLabel={t('indifferent_status')}
          topLabel={sliderTopLabel}
          onChange={handleSliderChange}
          onCommit={handleCommit}
          onThumbWheel={handleThumbWheel}
          readOnly={readOnly}
          variant={effectiveVariant}
        />
      </div>

      {isAnonymousView && (
        <div className="mt-2 flex justify-center">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary gap-2">
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              {t('sign_in_to_compare') || 'Inicia sesión para comparar'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
