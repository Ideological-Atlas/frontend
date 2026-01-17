'use client';

import { useRef } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import type { InitialServerData } from '@/types/atlas';

interface StoreInitializerProps {
  data: InitialServerData;
}

export function StoreInitializer({ data }: StoreInitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAtlasStore.getState().initializeStructure(data);
    initialized.current = true;
  }

  return null;
}
