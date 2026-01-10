'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, type MouseEvent } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
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

export function Button({ className, variant = 'primary', children, onClick, ...props }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
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
    primary: 'bg-primary hover:bg-blue-600 text-primary-foreground shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline:
      'bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground h-12 px-6 text-base',
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} onClick={createRipple} {...props}>
      <span className="pointer-events-none relative z-10 truncate">{children}</span>

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
    </button>
  );
}
