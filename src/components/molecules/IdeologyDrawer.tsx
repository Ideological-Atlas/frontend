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

  const tabs: { id: TabType; icon: string; label: string; colorClass: string; bgClass: string }[] = [
    {
      id: 'supporter',
      icon: 'thumb_up',
      label: t('tab_supporter'),
      colorClass: 'text-affinity-identical',
      bgClass: 'bg-affinity-identical/10 border-affinity-identical/20',
    },
    {
      id: 'neutral',
      icon: 'balance',
      label: t('tab_neutral'),
      colorClass: 'text-affinity-compatible',
      bgClass: 'bg-affinity-compatible/10 border-affinity-compatible/20',
    },
    {
      id: 'detractor',
      icon: 'thumb_down',
      label: t('tab_detractor'),
      colorClass: 'text-affinity-opposite',
      bgClass: 'bg-affinity-opposite/10 border-affinity-opposite/20',
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
        className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-2xl flex-col border-l border-white/10 bg-zinc-950 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-96 w-full shrink-0 overflow-hidden bg-zinc-950">
          <div
            className="absolute inset-0 z-0 opacity-50 transition-colors duration-700"
            style={{ backgroundColor: bgColor }}
          />

          {ideology.flag && (
            <div
              className="absolute inset-0 z-10 h-full w-full"
              style={{
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              }}
            >
              <Image src={ideology.flag} alt={ideology.name} fill className="object-cover opacity-100" unoptimized />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="absolute bottom-0 left-0 z-30 flex w-full flex-col p-8 md:p-12">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-md">
                {t('ideology_tag')}
              </span>
              {ideology.associated_countries.map(c => (
                <span
                  key={c.id}
                  className="flex items-center gap-1 rounded border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[14px]">public</span>
                  {c.name}
                </span>
              ))}
              {ideology.associated_regions.map(r => (
                <span
                  key={r.id}
                  className="flex items-center gap-1 rounded border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {r.name}
                </span>
              ))}
            </div>

            <div className="flex items-end gap-6">
              <h2 className="text-5xl leading-[0.9] font-black tracking-tighter text-white drop-shadow-2xl md:text-6xl">
                {ideology.name}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-zinc-950">
          <div className="px-8 py-8 md:px-12">
            <div className="mb-10 grid grid-cols-3 gap-4">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'flex flex-col items-center justify-center gap-3 rounded-xl border py-5 transition-all duration-300',
                      isActive
                        ? `${tab.bgClass} border-opacity-100 bg-opacity-10 shadow-lg`
                        : 'text-muted-foreground border-white/5 bg-zinc-900/40 hover:border-white/10 hover:bg-zinc-900',
                    )}
                  >
                    <span
                      className={clsx(
                        'material-symbols-outlined text-2xl transition-colors',
                        isActive ? tab.colorClass : 'text-muted-foreground opacity-60',
                      )}
                    >
                      {tab.icon}
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-bold tracking-wider uppercase',
                        isActive ? 'text-foreground' : 'text-muted-foreground opacity-60',
                      )}
                    >
                      {tab.label}
                    </span>
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
                transition={{ duration: 0.3 }}
              >
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-lg leading-relaxed font-light whitespace-pre-line text-zinc-300">
                    {currentDescription || t('no_description')}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-white/10 bg-zinc-950 p-6 pb-10 md:px-12">
          <div className="flex gap-4">
            <Button onClick={onClose} variant="ghost" className="h-14 flex-1 text-zinc-400 hover:text-white">
              {t('close')}
            </Button>

            {showExploreAction && (
              <Link href={`/encyclopedia/${ideology.uuid}/definitions`} className="flex-[2]">
                <Button
                  variant="primary"
                  className="shadow-primary/20 h-14 w-full border-none bg-green-600 text-lg font-bold text-white shadow-xl hover:bg-green-700"
                >
                  {t('explore_in_atlas')}
                  <span className="material-symbols-outlined ml-2 text-xl">explore</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
