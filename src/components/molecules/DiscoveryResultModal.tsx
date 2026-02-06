'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { DiscoveryHeader } from './DiscoveryHeader';
import { PerspectiveSelector, type PerspectiveType } from './PerspectiveSelector';
import { ExpandableDescription } from './ExpandableDescription';

interface DiscoveryResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: IdeologyList | null;
  affinity: number;
}

export function DiscoveryResultModal({ isOpen, onClose, winner, affinity }: DiscoveryResultModalProps) {
  const t = useTranslations('Atlas');
  const [activeTab, setActiveTab] = useState<PerspectiveType>('neutral');

  if (!winner) return null;

  const currentDescription =
    activeTab === 'neutral'
      ? winner.description_neutral
      : activeTab === 'supporter'
        ? winner.description_supporter
        : winner.description_detractor;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-background/80 absolute inset-0 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="bg-card border-border relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-2xl"
          >
            <DiscoveryHeader winner={winner} />

            <div className="flex flex-1 flex-col overflow-y-auto p-6 text-center md:p-8">
              <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
                {t('discovery_modal_subtitle')}
              </p>

              <h1 className="text-foreground mb-2 text-4xl font-black">{winner.name}</h1>

              <div className="bg-primary/10 text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-bold">
                <span className="material-symbols-outlined text-lg">verified</span>
                {Math.round(affinity)}% {t('affinity_score')}
              </div>

              <PerspectiveSelector activeTab={activeTab} onSelect={setActiveTab} />

              <ExpandableDescription text={currentDescription} id={activeTab} />

              <div className="mt-auto flex w-full flex-col gap-3">
                <Link href={`/encyclopedia/${winner.uuid}/definitions`} className="w-full">
                  <Button variant="primary" size="lg" className="shadow-primary/20 w-full shadow-lg">
                    {t('view_comparison')}
                    <span className="material-symbols-outlined ml-2">compare_arrows</span>
                  </Button>
                </Link>
                <Button variant="ghost" onClick={onClose}>
                  {t('close_modal')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
