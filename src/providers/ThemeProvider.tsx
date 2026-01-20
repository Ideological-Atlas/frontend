'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useAuthStore } from '@/store/useAuthStore';
import { AppearanceEnum } from '@/lib/client/models/AppearanceEnum';

function ThemeSync() {
  const { user } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (user?.appearance) {
        const targetTheme = user.appearance === AppearanceEnum.AUTO ? 'system' : user.appearance;
        if (theme !== targetTheme) setTheme(targetTheme);
      }
      return;
    }

    if (user?.appearance) {
      const targetTheme = user.appearance === AppearanceEnum.AUTO ? 'system' : user.appearance;

      if (theme !== targetTheme) {
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setTheme(targetTheme);
          });
        } else {
          setTheme(targetTheme);
        }
      }
    }
  }, [user?.appearance, setTheme, theme]);

  return null;
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
