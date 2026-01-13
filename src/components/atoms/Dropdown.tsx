'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useMenuAnimation } from '@/hooks/useMenuAnimation';

interface DropdownProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
}

export function Dropdown({ value, options, onChange, label, suffix = '%' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scope.current && !scope.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [scope]);

  return (
    <div ref={scope} className="relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors',
          'bg-secondary/50 border-border hover:bg-secondary',
          isOpen ? 'ring-primary/20 border-primary/50 ring-2' : '',
        )}
      >
        {label && <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">{label}</span>}
        <div className="flex items-center gap-1">
          <span className="text-foreground min-w-[3ch] text-right text-sm font-bold">
            {value}
            {suffix}
          </span>
          <span
            className="material-symbols-outlined text-muted-foreground text-[16px] transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            keyboard_arrow_down
          </span>
        </div>
      </motion.button>

      <nav
        className={clsx(
          'border-border/50 absolute top-full right-0 z-50 mt-2 min-w-[120px] origin-top-right rounded-xl border shadow-2xl',
          'bg-zinc-900',
          !isOpen && 'pointer-events-none',
        )}
        style={{ opacity: 0 }}
      >
        <ul className="scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex max-h-[240px] flex-col gap-1 overflow-y-auto p-1">
          {options.map(option => (
            <motion.li
              key={option}
              className={clsx(
                'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-right text-sm font-bold transition-colors',
                value === option
                  ? 'bg-primary text-primary-foreground'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
              )}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span className="text-xs font-normal opacity-50">{value === option && 'Actual'}</span>
              <span>
                {option}
                {suffix}
              </span>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
