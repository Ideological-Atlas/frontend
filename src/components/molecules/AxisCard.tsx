'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/atoms/Slider';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';

interface AxisCardProps {
  axis: IdeologyAxis;
  onSave: (uuid: string, value: number) => void;
  defaultValue?: number;
}

export function AxisCard({ axis, onSave, defaultValue = 0 }: AxisCardProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const handleCommit = () => {
    onSave(axis.uuid, value);
  };

  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-1">
        <h4 className="text-foreground text-lg font-bold">{axis.name}</h4>
        {axis.description && <p className="text-muted-foreground text-sm">{axis.description}</p>}
      </div>
      <div className="mt-2 px-2">
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={value}
          onChange={handleChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
        />
      </div>
    </div>
  );
}
