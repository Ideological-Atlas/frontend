'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import * as Switch from '@radix-ui/react-switch';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-secondary h-7 w-[52px] rounded-full" />;

  const isDark = theme === 'dark';

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <div className="flex items-center">
      <Switch.Root
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={clsx(
          'switch-track',
          'border-border focus-visible:ring-primary relative h-7 w-[52px] cursor-pointer rounded-full border shadow-inner transition-colors outline-none focus-visible:ring-2',
          'bg-secondary/50 hover:bg-secondary',
        )}
      >
        <motion.div
          layout
          transition={{
            duration: 1.6,
            ease: [0.25, 1, 0.5, 1],
            type: 'tween',
          }}
          className={clsx(
            'switch-thumb',
            'block h-5 w-5 rounded-full shadow-sm shadow-black/20',
            isDark ? 'bg-background translate-x-[26px]' : 'translate-x-[4px] bg-white',
          )}
        >
          <div className="flex h-full w-full items-center justify-center text-[14px]">
            {isDark ? (
              <span className="material-symbols-outlined text-primary text-[14px]">dark_mode</span>
            ) : (
              <span className="material-symbols-outlined text-[14px] text-amber-500">light_mode</span>
            )}
          </div>
        </motion.div>
      </Switch.Root>
    </div>
  );
}
