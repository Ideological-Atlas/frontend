'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { IdeologyDrawerHeader } from './ideology/IdeologyDrawerHeader';
import { IdeologyDrawerTabs, type TabType } from './ideology/IdeologyDrawerTabs';
import { IdeologyDrawerContent } from './ideology/IdeologyDrawerContent';
import { IdeologyDrawerFooter } from './ideology/IdeologyDrawerFooter';

interface IdeologyDrawerProps {
  ideology: IdeologyList | null;
  onClose: () => void;
  showExploreAction?: boolean;
}

export function IdeologyDrawer({ ideology, onClose, showExploreAction = true }: IdeologyDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('neutral');

  if (!ideology) return null;

  const currentDescription =
    activeTab === 'neutral'
      ? ideology.description_neutral
      : activeTab === 'supporter'
        ? ideology.description_supporter
        : ideology.description_detractor;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-xl flex-col border-l border-white/10 bg-zinc-950 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <IdeologyDrawerHeader ideology={ideology} onClose={onClose} />

        <div className="flex flex-1 flex-col overflow-y-auto bg-zinc-950">
          <div className="p-6 md:p-8">
            <IdeologyDrawerTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <IdeologyDrawerContent activeTab={activeTab} description={currentDescription} />
          </div>
        </div>

        <IdeologyDrawerFooter onClose={onClose} showExploreAction={showExploreAction} uuid={ideology.uuid} />
      </motion.div>
    </>
  );
}
