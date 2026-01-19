'use client';

import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion';
import { useTranslations } from 'next-intl';

const button = tv({
  base: 'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden tracking-[0.015em] active:scale-95',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      other: 'bg-other-user text-white hover:bg-other-user/90 shadow-sm',
    },
    size: {
      default: 'h-10 px-4 py-2 min-w-[84px]',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-12 rounded-lg px-8 text-base',
      icon: 'h-10 w-10 min-w-0',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'>, VariantProps<typeof button> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, isLoading = false, loadingText, onClick, ...props }, ref) => {
    const t = useTranslations('Common');
    const [ripples, setRipples] = React.useState<{ x: number; y: number; size: number; id: number }[]>([]);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || props.disabled) return;
      const btn = event.currentTarget;
      const rect = btn.getBoundingClientRect();
      const s = Math.max(btn.clientWidth, btn.clientHeight);
      setRipples(prev => [
        ...prev,
        { x: event.clientX - rect.left - s / 2, y: event.clientY - rect.top - s / 2, size: s, id: Date.now() },
      ]);
      onClick?.(event);
    };

    return (
      <motion.button
        ref={ref}
        className={button({ variant, size, className })}
        onClick={createRipple}
        disabled={props.disabled || isLoading}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <Spinner />
              <span>{loadingText || t('processing')}</span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10 flex items-center justify-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {ripples.map(r => (
            <motion.span
              key={r.id}
              initial={{ transform: 'scale(0)', opacity: 0.35 }}
              animate={{ transform: 'scale(2)', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))}
              className="pointer-events-none absolute rounded-full bg-current"
              style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    );
  },
);
Button.displayName = 'Button';

export { Button, button };
