'use client';

import { useEffect, useState } from 'react';
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
  const getInitialMargin = (m?: number) => (m !== undefined && m !== null ? m : 10);

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
    <div className="bg-card border-border relative z-0 flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-foreground text-lg font-bold">{axis.name}</h4>
          {axis.description && <p className="text-muted-foreground text-sm leading-relaxed">{axis.description}</p>}
        </div>

        <div className="relative z-20">
          <Dropdown value={displayedMargin} options={marginOptions} onChange={handleDropdownChange} label="Margen" />
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
