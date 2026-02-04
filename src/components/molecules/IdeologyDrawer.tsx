'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface IdeologyDrawerProps {
  ideology: IdeologyList | null;
  onClose: () => void;
  showExploreAction?: boolean;
}

type TabType = 'neutral' | 'supporter' | 'detractor';

export function IdeologyDrawer({ ideology, onClose, showExploreAction = true }: IdeologyDrawerProps) {
  const t = useTranslations('Encyclopedia');
  const [activeTab, setActiveTab] = useState<TabType>('neutral');

  if (!ideology) return null;

  const bgColor = ideology.color || '#64748b';

  const tabs: { id: TabType; icon: string; label: string; activeClass: string }[] = [
    {
      id: 'supporter',
      icon: 'thumb_up',
      label: t('tab_supporter'),
      activeClass: 'bg-zinc-800 text-green-400 border-green-500/50',
    },
    {
      id: 'neutral',
      icon: 'balance',
      label: t('tab_neutral'),
      activeClass: 'bg-zinc-800 text-blue-400 border-blue-500/50',
    },
    {
      id: 'detractor',
      icon: 'thumb_down',
      label: t('tab_detractor'),
      activeClass: 'bg-zinc-800 text-red-400 border-red-500/50',
    },
  ];

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
        <div className="relative h-64 w-full shrink-0 overflow-hidden bg-zinc-950">
          <div
            className="absolute inset-0 z-0 opacity-60 transition-colors duration-700"
            style={{ backgroundColor: bgColor }}
          />

          {ideology.flag && (
            <div
              className="absolute inset-0 z-10 h-full w-full"
              style={{
                maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              }}
            >
              <Image
                src={ideology.flag}
                alt={ideology.name}
                fill
                className="object-cover opacity-80 mix-blend-overlay"
                unoptimized
              />
            </div>
          )}

          <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="absolute bottom-0 left-0 z-30 flex w-full flex-col p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                {t('ideology_tag')}
              </span>
              {ideology.associated_countries.map(c => (
                <span
                  key={c.id}
                  className="flex items-center gap-1 rounded border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[12px]">public</span>
                  {c.name}
                </span>
              ))}
            </div>

            <h2 className="text-4xl leading-none font-black tracking-tight text-white drop-shadow-xl md:text-5xl">
              {ideology.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-zinc-950">
          <div className="p-6 md:p-8">
            <div className="mb-8 flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-1">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-3 transition-all duration-200',
                      isActive
                        ? `${tab.activeClass} border shadow-sm`
                        : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300',
                    )}
                  >
                    <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-base leading-relaxed font-normal whitespace-pre-line text-zinc-400">
                    {currentDescription || t('no_description')}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="text-xs font-bold text-zinc-500 uppercase transition-colors hover:text-white"
            >
              {t('close')}
            </button>

            {showExploreAction && (
              <Link href={`/encyclopedia/${ideology.uuid}/definitions`}>
                <Button
                  variant="primary"
                  className="border-none bg-green-600 px-6 text-white shadow-lg shadow-green-900/20 hover:bg-green-500"
                >
                  {t('explore_in_atlas')}
                  <span className="material-symbols-outlined ml-2 text-lg">explore</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
