'use client';

import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

export type TabType = 'neutral' | 'supporter' | 'detractor';

interface IdeologyDrawerTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function IdeologyDrawerTabs({ activeTab, onTabChange }: IdeologyDrawerTabsProps) {
  const t = useTranslations('Encyclopedia');

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

  return (
    <div className="mb-8 flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-1">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-3 transition-all duration-200',
              isActive ? `${tab.activeClass} border shadow-sm` : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300',
            )}
          >
            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
