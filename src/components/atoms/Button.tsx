'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion';
import { useState, type MouseEvent } from 'react';
import { useTranslations } from 'next-intl';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function Button({
  className,
  variant = 'primary',
  children,
  onClick,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const t = useTranslations('Common');
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const effectiveLoadingText = loadingText || t('processing');

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);

    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };

    setRipples(prev => [...prev, newRipple]);

    if (onClick) {
      onClick(event);
    }
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id));
  };

  const baseStyles =
    'relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 transition-colors text-sm font-bold leading-normal tracking-[0.015em] min-w-[84px] select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
    outline: 'bg-accent hover:bg-accent-hover h-12 px-6 text-base',
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], className)}
      onClick={createRipple}
      disabled={disabled || isLoading}
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex items-center justify-center gap-2"
          >
            <Spinner />
            <span>{effectiveLoadingText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="pointer-events-none relative z-10 flex items-center justify-center gap-2 truncate"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ transform: 'scale(0)', opacity: 0.35 }}
            animate={{ transform: 'scale(2)', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            className="pointer-events-none absolute rounded-full bg-current"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
