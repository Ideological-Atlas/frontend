'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import * as Switch from '@radix-ui/react-switch';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';
import { UsersService } from '@/lib/client/services/UsersService';
import { AppearanceEnum } from '@/lib/client/models/AppearanceEnum';

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-secondary h-7 w-[52px] rounded-full" />;

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';

    if (isAuthenticated && user) {
      setUser({ ...user, appearance: newTheme as AppearanceEnum });
      
      UsersService.mePartialUpdate({ 
        appearance: newTheme as AppearanceEnum 
      }).catch((err) => {
        console.error('Error syncing theme preference:', err);
      });
    } else {
      const updateVisuals = () => {
        setTheme(newTheme);
      };

      if (!document.startViewTransition) {
        updateVisuals();
      } else {
        document.startViewTransition(updateVisuals);
      }
    }
  };

  return (
    <div className="flex items-center">
      <Switch.Root
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={clsx(
          "switch-track",
          "relative h-7 w-[52px] cursor-pointer rounded-full border border-border shadow-inner outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
          "bg-secondary/50 hover:bg-secondary"
        )}
      >
        <motion.div
          layout
          transition={{
            duration: 1.6,
            ease: [0.25, 1, 0.5, 1],
            type: "tween"
          }}
          className={clsx(
            "switch-thumb",
            "block h-5 w-5 rounded-full shadow-sm shadow-black/20",
            isDark ? "bg-background translate-x-[26px]" : "bg-white translate-x-[4px]"
          )}
        >
          <div className="flex h-full w-full items-center justify-center text-[14px]">
            {isDark ? (
              <span className="material-symbols-outlined text-[14px] text-primary">dark_mode</span>
            ) : (
              <span className="material-symbols-outlined text-[14px] text-amber-500">light_mode</span>
            )}
          </div>
        </motion.div>
      </Switch.Root>
    </div>
  );
}
