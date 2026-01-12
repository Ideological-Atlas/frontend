'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { configureOpenAPI } from '@/lib/api-config';
import { OpenAPI } from '@/lib/client/core/OpenAPI';

interface ApiConfigProviderProps {
  children: React.ReactNode;
}

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  const locale = useLocale();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    configureOpenAPI();

    OpenAPI.HEADERS = {
      ...(OpenAPI.HEADERS as Record<string, string>),
      'Accept-Language': locale,
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, [locale]);

  if (!isReady) return null;

  return <>{children}</>;
}
