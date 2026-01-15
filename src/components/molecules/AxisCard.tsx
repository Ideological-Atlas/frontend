'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/atoms/Slider';
import { Dropdown } from '@/components/atoms/Dropdown';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';

interface AxisCardProps {
  axis: IdeologyAxis;
  onSave: (uuid: string, data: AnswerUpdatePayload) => void;
  answerData?: AnswerData;
}

export function AxisCard({ axis, onSave, answerData }: AxisCardProps) {
  const t = useTranslations('Atlas');
  const getInitialMargin = (m?: number) => (m !== undefined && m !== null ? m : 10);
  const isAnswered = !!answerData;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [state, setState] = useState({
    value: answerData?.value ?? 0,
    marginLeft: getInitialMargin(answerData?.margin_left),
    marginRight: getInitialMargin(answerData?.margin_right),
  });

  useEffect(() => {
    if (answerData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(prev => {
        const newValue = answerData.value;
        const newLeft = getInitialMargin(answerData.margin_left);
        const newRight = getInitialMargin(answerData.margin_right);

        if (prev.value === newValue && prev.marginLeft === newLeft && prev.marginRight === newRight) {
          return prev;
        }
        return { value: newValue, marginLeft: newLeft, marginRight: newRight };
      });
    }
  }, [answerData]);

  const handleChange = (updates: { value?: number; marginLeft?: number; marginRight?: number }) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleCommit = () => {
    onSave(axis.uuid, {
      value: state.value,
      margin_left: state.marginLeft,
      margin_right: state.marginRight,
    });
  };

  const handleDropdownChange = (targetMargin: number) => {
    const maxMarginLeft = state.value + 100;
    const maxMarginRight = 100 - state.value;
    const safeMargin = Math.min(targetMargin, maxMarginLeft, maxMarginRight);

    const newState = {
      ...state,
      marginLeft: safeMargin,
      marginRight: safeMargin,
    };

    setState(newState);
    onSave(axis.uuid, {
      value: newState.value,
      margin_left: newState.marginLeft,
      margin_right: newState.marginRight,
    });
  };

  const marginOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const displayedMargin = state.marginLeft;

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        isAnswered ? 'border-primary bg-primary/5' : 'bg-card border-border',
        isDropdownOpen ? 'z-50' : 'z-0',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className={clsx('text-lg font-bold', isAnswered ? 'text-primary' : 'text-foreground')}>{axis.name}</h4>
            {isAnswered && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center rounded-full bg-green-500/20 p-0.5"
              >
                <span className="material-symbols-outlined text-[18px] font-bold text-green-600">check</span>
              </motion.div>
            )}
          </div>
          {axis.description && <p className="text-muted-foreground text-sm leading-relaxed">{axis.description}</p>}
        </div>

        <div className="relative z-20 min-w-[120px]">
          <Dropdown
            value={displayedMargin}
            options={marginOptions}
            onChange={handleDropdownChange}
            label={t('margin_label')}
            align="end"
            onOpenChange={setIsDropdownOpen}
          />
        </div>
      </div>

      <div className="relative z-10 px-2 pb-2">
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={state.value}
          marginLeft={state.marginLeft}
          marginRight={state.marginRight}
          onChange={handleChange}
          onCommit={handleCommit}
        />
      </div>
    </div>
  );
}
