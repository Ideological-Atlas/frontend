'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/atoms/Slider';
import { Dropdown } from '@/components/atoms/Dropdown';
import { DependencyBadge } from '@/components/atoms/DependencyBadge';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';

interface AxisCardProps {
  axis: IdeologyAxis;
  onSave: (uuid: string, data: AnswerUpdatePayload) => void;
  onDelete: (uuid: string) => void;
  answerData?: AnswerData;
}

const getInitialMargin = (m?: number | null) => (m !== undefined && m !== null ? m : 10);

export function AxisCard({ axis, onSave, onDelete, answerData }: AxisCardProps) {
  const t = useTranslations('Atlas');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [value, setValue] = useState(answerData?.value ?? 0);
  const [marginLeft, setMarginLeft] = useState(getInitialMargin(answerData?.margin_left));
  const [marginRight, setMarginRight] = useState(getInitialMargin(answerData?.margin_right));
  const [isIndifferent, setIsIndifferent] = useState(answerData?.is_indifferent ?? false);

  const currentProps = {
    val: answerData?.value,
    indifferent: answerData?.is_indifferent,
    ml: answerData?.margin_left,
    mr: answerData?.margin_right,
    hasAns: !!answerData,
  };

  const [prevProps, setPrevProps] = useState(currentProps);

  const hasPropsChanged =
    prevProps.val !== currentProps.val ||
    prevProps.indifferent !== currentProps.indifferent ||
    prevProps.ml !== currentProps.ml ||
    prevProps.mr !== currentProps.mr ||
    prevProps.hasAns !== currentProps.hasAns;

  if (hasPropsChanged) {
    setPrevProps(currentProps);
    setValue(currentProps.val ?? 0);
    setIsIndifferent(currentProps.indifferent ?? false);
    setMarginLeft(getInitialMargin(currentProps.ml));
    setMarginRight(getInitialMargin(currentProps.mr));
  }

  const isAnswered = answerData !== undefined;

  const handleSliderChange = (updates: { value?: number; marginLeft?: number; marginRight?: number }) => {
    if (isIndifferent) return;
    if (updates.value !== undefined) setValue(updates.value);
    if (updates.marginLeft !== undefined) setMarginLeft(updates.marginLeft);
    if (updates.marginRight !== undefined) setMarginRight(updates.marginRight);
  };

  const handleCommit = () => {
    if (isIndifferent) return;
    onSave(axis.uuid, {
      value,
      margin_left: marginLeft,
      margin_right: marginRight,
      is_indifferent: false,
    });
  };

  const handleDropdownChange = (targetMargin: number) => {
    const maxMarginLeft = value + 100;
    const maxMarginRight = 100 - value;
    const safeMargin = Math.min(targetMargin, maxMarginLeft, maxMarginRight);

    setMarginLeft(safeMargin);
    setMarginRight(safeMargin);

    onSave(axis.uuid, {
      value,
      margin_left: safeMargin,
      margin_right: safeMargin,
      is_indifferent: false,
    });
  };

  const toggleIndifferent = () => {
    const newIndifferentState = !isIndifferent;
    setIsIndifferent(newIndifferentState);

    if (newIndifferentState) {
      setValue(0);
      setMarginLeft(10);
      setMarginRight(10);

      onSave(axis.uuid, {
        is_indifferent: true,
        value: null,
        margin_left: null,
        margin_right: null,
      });
    } else {
      onSave(axis.uuid, {
        is_indifferent: false,
        value,
        margin_left: marginLeft,
        margin_right: marginRight,
      });
    }
  };

  const handleReset = () => {
    onDelete(axis.uuid);
  };

  const marginOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const isSymmetric = marginLeft === marginRight;
  const marginDisplayValue = isSymmetric ? marginLeft : t('asymmetric_label');

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        isAnswered && !isIndifferent ? 'border-primary bg-primary/5' : 'bg-card border-border',
        isIndifferent ? 'opacity-75' : '',
        isDropdownOpen ? 'z-50' : 'z-0',
      )}
    >
      <DependencyBadge rules={axis.condition_rules} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4
              className={clsx('text-lg font-bold', isAnswered && !isIndifferent ? 'text-primary' : 'text-foreground')}
            >
              {axis.name}
            </h4>

            {isAnswered && !isIndifferent && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center rounded-full bg-green-500/20 p-0.5"
              >
                <span className="material-symbols-outlined text-[18px] font-bold text-green-600">check</span>
              </motion.div>
            )}
            {isIndifferent && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center rounded-full bg-gray-500/20 p-0.5"
              >
                <span className="material-symbols-outlined text-[18px] font-bold text-gray-500">remove</span>
              </motion.div>
            )}
          </div>
          {axis.description && <p className="text-muted-foreground text-sm leading-relaxed">{axis.description}</p>}
        </div>

        <div className="flex items-center gap-2 pr-4 md:pr-0">
          {isAnswered && (
            <button
              onClick={handleReset}
              title={t('reset_label')}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
          )}

          {!isIndifferent && (
            <div className="relative z-20 min-w-[120px]">
              <Dropdown<number | string>
                value={marginDisplayValue}
                options={marginOptions}
                onChange={val => handleDropdownChange(val as number)}
                label={t('margin_label')}
                align="end"
                onOpenChange={setIsDropdownOpen}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleIndifferent}
          className={clsx(
            'flex h-5 w-5 items-center justify-center rounded border transition-colors',
            isIndifferent
              ? 'bg-primary border-primary'
              : 'border-muted-foreground hover:border-foreground bg-transparent',
          )}
        >
          {isIndifferent && (
            <span className="material-symbols-outlined text-primary-foreground text-[16px] font-bold">check</span>
          )}
        </button>
        <button
          onClick={toggleIndifferent}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {t('indifferent_label')}
        </button>
      </div>

      <div
        className={clsx(
          'relative z-10 px-2 pb-2 transition-opacity duration-300',
          isIndifferent && 'pointer-events-none opacity-20 blur-[1px]',
        )}
      >
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={value}
          marginLeft={marginLeft}
          marginRight={marginRight}
          onChange={handleSliderChange}
          onCommit={handleCommit}
        />
      </div>
    </div>
  );
}
