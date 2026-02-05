'use client';

import { useTranslations } from 'next-intl';
import { Dropdown } from '@/components/atoms/Dropdown';

interface AxisControlsProps {
  hasAnswer: boolean;
  isIndifferent: boolean;
  readOnly: boolean;
  marginDisplayValue: number | string;
  marginOptions: number[];
  onDropdownChange: (val: number) => void;
  onReset: () => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  isComparisonMode: boolean;
}

export function AxisControls({
  hasAnswer,
  isIndifferent,
  readOnly,
  marginDisplayValue,
  marginOptions,
  onDropdownChange,
  onReset,
  onDropdownOpenChange,
}: AxisControlsProps) {
  const t = useTranslations('Atlas');

  // CORRECCIÓN: Permitimos mostrar controles aunque estemos en modo comparación
  if (!hasAnswer) return null;

  return (
    <div className="flex w-full shrink-0 items-center justify-end gap-2 md:w-auto md:justify-start">
      <button
        onClick={onReset}
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
            onChange={val => onDropdownChange(val as number)}
            label={t('margin_label')}
            align="end"
            onOpenChange={onDropdownOpenChange}
            variant="default"
          />
        </div>
      )}
    </div>
  );
}
