'use client';

import { useEffect } from 'react';
import { configureOpenAPI } from '@/lib/api-config';

interface ApiConfigProviderProps {
  children: React.ReactNode;
}

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  useEffect(() => {
    configureOpenAPI();
  }, []);

  return <>{children}</>;
}
