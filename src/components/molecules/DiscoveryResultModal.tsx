'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface DiscoveryResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: IdeologyList | null;
  affinity: number;
}

type TabType = 'neutral' | 'supporter' | 'detractor';

export function DiscoveryResultModal({ isOpen, onClose, winner, affinity }: DiscoveryResultModalProps) {
  const t = useTranslations('Atlas');
  const tEnc = useTranslations('Encyclopedia');
  const [activeTab, setActiveTab] = useState<TabType>('neutral');

  if (!winner) return null;

  const tabs: { id: TabType; icon: string; colorClass: string; activeBg: string }[] = [
    {
      id: 'supporter',
      icon: 'thumb_up',
      colorClass: 'text-affinity-identical',
      activeBg: 'bg-affinity-identical/10 ring-1 ring-affinity-identical/20',
    },
    {
      id: 'neutral',
      icon: 'balance',
      colorClass: 'text-affinity-compatible',
      activeBg: 'bg-affinity-compatible/10 ring-1 ring-affinity-compatible/20',
    },
    {
      id: 'detractor',
      icon: 'thumb_down',
      colorClass: 'text-affinity-opposite',
      activeBg: 'bg-affinity-opposite/10 ring-1 ring-affinity-opposite/20',
    },
  ];

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
            className="bg-card border-border relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
          >
            <div className="relative h-40 w-full overflow-hidden bg-zinc-900">
              <div className="absolute inset-0 opacity-60" style={{ backgroundColor: winner.color || '#333' }} />
              {winner.flag && (
                <Image
                  src={winner.flag}
                  alt={winner.name}
                  fill
                  className="object-cover opacity-50 mix-blend-overlay"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-6 left-0 w-full text-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white"
                >
                  <span className="material-symbols-outlined mb-2 text-5xl text-yellow-400 drop-shadow-lg">
                    emoji_events
                  </span>
                  <h2 className="text-3xl font-black tracking-tight drop-shadow-md">{t('discovery_modal_title')}</h2>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col items-center p-8 text-center">
              <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
                {t('discovery_modal_subtitle')}
              </p>

              <h1 className="text-foreground mb-2 text-4xl font-black">{winner.name}</h1>
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-bold">
                <span className="material-symbols-outlined text-lg">verified</span>
                {Math.round(affinity)}% {t('affinity_score')}
              </div>

              {/* Tabs de descripción */}
              <div className="bg-secondary/50 mb-6 flex w-full gap-1 rounded-lg p-1">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={e => {
                        e.stopPropagation();
                        setActiveTab(tab.id);
                      }}
                      className={clsx(
                        'relative flex h-9 flex-1 items-center justify-center rounded-md transition-all',
                        isActive ? tab.activeBg : 'hover:bg-background/50 text-muted-foreground',
                      )}
                      title={tEnc(`tab_${tab.id}`)}
                    >
                      <span
                        className={clsx(
                          'material-symbols-outlined text-[20px]',
                          isActive ? tab.colorClass : 'opacity-70',
                        )}
                      >
                        {tab.icon}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mb-8 min-h-[100px] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
                      {currentDescription || tEnc('no_description')}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex w-full flex-col gap-3">
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
