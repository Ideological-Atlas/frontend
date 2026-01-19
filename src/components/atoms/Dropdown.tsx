'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';

interface DropdownProps<T extends string | number> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label?: string;
  suffix?: string;
  onOpenChange?: (isOpen: boolean) => void;
  align?: 'start' | 'end';
  variant?: 'default' | 'other';
}

export function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  label,
  suffix = '',
  onOpenChange,
  align = 'start',
  variant = 'default',
}: DropdownProps<T>) {
  const t = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);
  const isOther = variant === 'other';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scope.current && !scope.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [scope]);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  const activeRing = isOther ? 'ring-other-user/20 border-other-user/50' : 'ring-primary/20 border-primary/50';
  const selectedBg = isOther ? 'bg-other-user text-white' : 'bg-primary text-primary-foreground';

  return (
    <div ref={scope} className="relative inline-block w-full text-left">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-1.5 transition-colors',
          'bg-secondary/50 border-border hover:bg-secondary',
          isOpen ? `${activeRing} ring-2` : '',
        )}
      >
        <div className="flex items-center gap-2">
          {label && <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">{label}</span>}
          <div className="flex items-center gap-1">
            <span className="text-foreground min-w-[3ch] truncate text-left text-sm font-bold">
              {value}
              {suffix}
            </span>
          </div>
        </div>
        <span
          className="material-symbols-outlined text-muted-foreground text-[16px] transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          keyboard_arrow_down
        </span>
      </motion.button>

      <nav
        className={clsx(
          'border-border/50 absolute top-full z-50 mt-2 w-full min-w-[140px] rounded-xl border shadow-2xl',
          'bg-zinc-900',
          align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          !isOpen && 'pointer-events-none',
        )}
        style={{ opacity: 0 }}
      >
        <ul className="scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex max-h-[240px] flex-col gap-1 overflow-y-auto p-1">
          {options.map(option => (
            <motion.li
              key={String(option)}
              className={clsx(
                'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold transition-colors',
                value === option ? selectedBg : 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
              )}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span className="truncate">
                {option}
                {suffix}
              </span>
              <span className="ml-2 text-xs font-normal opacity-50">{value === option && t('current')}</span>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
