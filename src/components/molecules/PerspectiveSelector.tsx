import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

export type PerspectiveType = 'neutral' | 'supporter' | 'detractor';

interface PerspectiveSelectorProps {
  activeTab: PerspectiveType;
  onSelect: (tab: PerspectiveType) => void;
}

export function PerspectiveSelector({ activeTab, onSelect }: PerspectiveSelectorProps) {
  const tEnc = useTranslations('Encyclopedia');

  const tabs: { id: PerspectiveType; icon: string; colorClass: string; activeBg: string }[] = [
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
    <div className="bg-secondary/50 mb-6 flex w-full gap-1 rounded-lg p-1">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={e => {
              e.stopPropagation();
              onSelect(tab.id);
            }}
            className={clsx(
              'relative flex h-9 flex-1 items-center justify-center rounded-md transition-all',
              isActive ? tab.activeBg : 'hover:bg-background/50 text-muted-foreground',
            )}
            title={tEnc(`tab_${tab.id}`)}
          >
            <span className={clsx('material-symbols-outlined text-[20px]', isActive ? tab.colorClass : 'opacity-70')}>
              {tab.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
