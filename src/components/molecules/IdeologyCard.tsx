'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { Link } from '@/components/atoms/SmartLink';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface IdeologyCardProps {
  ideology: IdeologyList;
  index: number;
  onClick: () => void;
}

type TabType = 'neutral' | 'supporter' | 'detractor';

export function IdeologyCard({ ideology, index, onClick }: IdeologyCardProps) {
  const t = useTranslations('Encyclopedia');
  const [activeTab, setActiveTab] = useState<TabType>('neutral');

  const bgColor = ideology.color || '#64748b';

  const handleTabClick = (e: React.MouseEvent, tab: TabType) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const currentDescription =
    activeTab === 'neutral'
      ? ideology.description_neutral
      : activeTab === 'supporter'
        ? ideology.description_supporter
        : ideology.description_detractor;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="bg-card border-border group hover:border-primary/30 relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-36 w-full overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: bgColor }} />

        {ideology.flag ? (
          <div
            className="absolute top-0 left-0 z-10 h-full w-[75%]"
            style={{
              maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
            }}
          >
            <Image
              src={ideology.flag}
              alt={ideology.name}
              fill
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-white/20">
            <span className="material-symbols-outlined text-6xl mix-blend-overlay">flag</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundColor: bgColor }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pt-5 pb-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-2xl leading-tight font-black tracking-tight transition-colors">
            {ideology.name}
          </h3>

          <div className="bg-secondary/50 flex shrink-0 gap-1 rounded-lg p-1" onClick={e => e.stopPropagation()}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={e => handleTabClick(e, tab.id)}
                  className={clsx(
                    'relative flex h-7 w-7 items-center justify-center rounded-md transition-all',
                    isActive ? tab.activeBg : 'hover:bg-background/50 text-muted-foreground',
                  )}
                  title={t(`tab_${tab.id}`)}
                >
                  <span
                    className={clsx('material-symbols-outlined text-[16px]', isActive ? tab.colorClass : 'opacity-70')}
                  >
                    {tab.icon}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <div className="relative min-h-[4.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground line-clamp-3 text-sm leading-relaxed font-medium whitespace-pre-line"
              >
                {currentDescription || t('no_description')}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <Link
          href={`/encyclopedia/${ideology.uuid}/definitions`}
          onClick={e => e.stopPropagation()}
          className="border-border/50 group/btn mt-6 flex items-center justify-between border-t pt-4"
        >
          <span className="text-muted-foreground group-hover/btn:text-foreground text-xs font-black tracking-wider uppercase transition-colors">
            {t('explore_in_atlas')}
          </span>
          <div className="bg-secondary text-foreground group-hover/btn:bg-primary group-hover/btn:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all">
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
