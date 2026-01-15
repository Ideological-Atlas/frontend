'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Dropdown } from '@/components/atoms/Dropdown';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import { TypeEnum } from '@/lib/client/models/TypeEnum';

interface ConditionerCardProps {
  conditioner: IdeologyConditioner;
  onSave: (uuid: string, value: string) => void;
  answer?: string;
}

export function ConditionerCard({ conditioner, onSave, answer }: ConditionerCardProps) {
  const t = useTranslations('Atlas');
  const [value, setValue] = useState(answer || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAnswered = !!answer;

  useEffect(() => {
    if (answer !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(answer);
    }
  }, [answer]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onSave(conditioner.uuid, newValue);
  };

  const renderInput = () => {
    if (conditioner.type === TypeEnum.BOOLEAN) {
      return (
        <div className="flex gap-4">
          <Button
            variant={value === 'true' ? 'primary' : 'secondary'}
            onClick={() => handleChange('true')}
            className="w-24"
          >
            {t('yes')}
          </Button>
          <Button
            variant={value === 'false' ? 'primary' : 'secondary'}
            onClick={() => handleChange('false')}
            className="w-24"
          >
            {t('no')}
          </Button>
        </div>
      );
    }
    const hasOptions = Array.isArray(conditioner.accepted_values) && conditioner.accepted_values.length > 0;

    if (hasOptions) {
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
            />
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        isAnswered ? 'border-primary bg-primary/5' : 'bg-card border-border',
        isDropdownOpen ? 'z-50' : 'z-0',
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h4 className={clsx('text-lg font-bold', isAnswered ? 'text-primary' : 'text-foreground')}>
            {conditioner.name}
          </h4>
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
        {conditioner.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">{conditioner.description}</p>
        )}
      </div>

      <div className="relative z-10">{renderInput()}</div>
    </div>
  );
}
