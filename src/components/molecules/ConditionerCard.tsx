'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Dropdown } from '@/components/atoms/Dropdown';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { DependencyBadge } from '@/components/atoms/DependencyBadge';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import { TypeEnum } from '@/lib/client/models/TypeEnum';

interface ConditionerCardProps {
  conditioner: IdeologyConditioner;
  onSave?: (uuid: string, value: string) => void;
  onReset?: (uuid: string) => void;
  answer?: string;
  dependencyNames: string[];
  readOnly?: boolean;
  variant?: 'default' | 'other';
}

export function ConditionerCard({
  conditioner,
  onSave,
  onReset,
  answer,
  dependencyNames,
  readOnly = false,
  variant = 'default',
}: ConditionerCardProps) {
  const t = useTranslations('Atlas');
  const [value, setValue] = useState(answer || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAnswered = !!answer;
  const isOther = variant === 'other';

  useEffect(() => {
    if (answer !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(answer);
    } else {
      setValue('');
    }
  }, [answer]);

  const handleChange = (newValue: string) => {
    if (readOnly || !onSave) return;
    setValue(newValue);
    onSave(conditioner.uuid, newValue);
  };

  const handleReset = () => {
    if (readOnly || !onReset) return;
    setValue('');
    onReset(conditioner.uuid);
  };

  const activeBorder = isOther ? 'border-other-user' : 'border-primary';
  const activeBg = isOther ? 'bg-other-user/5' : 'bg-primary/5';
  const activeTitle = isOther ? 'text-other-user' : 'text-primary';
  const activeCheckText = isOther ? 'text-other-user' : 'text-green-600';
  const activeCheckBg = isOther ? 'bg-other-user/20' : 'bg-green-500/20';

  const renderInput = () => {
    if (conditioner.type === TypeEnum.BOOLEAN) {
      const activeBtnVariant = isOther ? 'other' : 'primary';

      return (
        <div className="flex gap-4">
          <Button
            variant={value === 'true' ? activeBtnVariant : 'secondary'}
            onClick={() => handleChange('true')}
            className="w-24"
            disabled={readOnly}
          >
            {t('yes')}
          </Button>
          <Button
            variant={value === 'false' ? activeBtnVariant : 'secondary'}
            onClick={() => handleChange('false')}
            className="w-24"
            disabled={readOnly}
          >
            {t('no')}
          </Button>
        </div>
      );
    }
    const hasOptions = Array.isArray(conditioner.accepted_values) && conditioner.accepted_values.length > 0;

    if (hasOptions) {
      if (readOnly) {
        return (
          <div className="border-border bg-muted text-muted-foreground w-full max-w-xs rounded-lg border px-3 py-2 text-sm font-medium">
            {value || t('select_placeholder')}
          </div>
        );
      }
      return (
        <div className="w-full max-w-xs">
          <Dropdown
            value={value || t('select_placeholder')}
            options={conditioner.accepted_values}
            onChange={val => handleChange(String(val))}
            label={t('options_label')}
            suffix=""
            onOpenChange={setIsDropdownOpen}
            align="end"
            variant={variant}
          />
        </div>
      );
    }
    switch (conditioner.type) {
      case TypeEnum.NUMERIC:
      case TypeEnum.SCALE:
        return (
          <div className="w-full max-w-xs">
            <Input
              type="number"
              value={value}
              onChange={e => handleChange(e.target.value)}
              placeholder={t('numeric_placeholder')}
              disabled={readOnly}
            />
          </div>
        );

      default:
        return (
          <div className="w-full">
            <Input
              type="text"
              value={value}
              onChange={e => handleChange(e.target.value)}
              placeholder={t('text_placeholder')}
              disabled={readOnly}
            />
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300',
        !readOnly && 'hover:shadow-md',
        isAnswered ? `${activeBorder} ${activeBg}` : 'bg-card border-border',
        isDropdownOpen ? 'z-50' : 'z-0',
      )}
    >
      <DependencyBadge names={dependencyNames} variant={variant} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className={clsx('text-lg font-bold', isAnswered ? activeTitle : 'text-foreground')}>
              {conditioner.name}
            </h4>
            {isAnswered && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={clsx('flex items-center justify-center rounded-full p-0.5', activeCheckBg)}
              >
                <span className={clsx('material-symbols-outlined text-[18px] font-bold', activeCheckText)}>check</span>
              </motion.div>
            )}
          </div>
          {conditioner.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{conditioner.description}</p>
          )}
        </div>

        {!readOnly && isAnswered && (
          <button
            onClick={handleReset}
            title={t('reset_label')}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground mr-8 flex h-8 w-8 items-center justify-center rounded-full transition-colors md:mr-0"
          >
            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          </button>
        )}
      </div>

      <div className="relative z-10">{renderInput()}</div>
    </div>
  );
}
