'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';
import { useTranslations } from 'next-intl';

interface SectionTabsProps {
  sections: IdeologySection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  affinityMap?: Record<string, number>;
  variant?: 'default' | 'other';
}

interface SectionTabProps {
  section: IdeologySection;
  isSelected: boolean;
  onSelect: () => void;
  affinity?: number | null;
  variant: 'default' | 'other';
}

function SectionTab({ section, isSelected, onSelect, affinity, variant }: SectionTabProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tCommon = useTranslations('Common');
  const isOther = variant === 'other';

  const hasAffinity = affinity !== undefined && affinity !== null;
  const affinityStyle = hasAffinity ? getAffinityBadgeStyles(affinity as number) : null;

  return (
    <div
      className={clsx(
        'group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
        isSelected ? (isOther ? 'text-other-user' : 'text-primary') : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <button onClick={onSelect} className="focus:outline-none">
        <span>{section.name}</span>
      </button>

      {section.description && (
        <div
          className="relative z-20 flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}
            className={clsx(
              'flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[9px] font-bold transition-all',
              isSelected
                ? 'border-current opacity-60 hover:opacity-100'
                : 'border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground',
            )}
          >
            ?
          </button>

          <AnimatePresence>
            {showTooltip && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
                  onClick={e => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    'fixed top-1/2 left-1/2 z-[101] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 cursor-default md:absolute md:top-full md:left-1/2 md:z-50 md:mt-2 md:w-64 md:translate-x-[-50%] md:translate-y-0',
                    'max-h-[50vh] overflow-y-auto rounded-xl shadow-2xl md:max-h-none md:overflow-visible',
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="bg-popover text-popover-foreground border-border relative flex flex-col rounded-xl border p-5 text-left shadow-2xl md:p-3 md:shadow-xl">
                    <div className="bg-popover border-t-border border-l-border absolute -top-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l md:block" />

                    <div className="mb-3 flex shrink-0 items-center justify-between md:hidden">
                      <span className="text-sm font-bold tracking-wider uppercase">{tCommon('info')}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setShowTooltip(false);
                        }}
                        className="text-muted-foreground hover:text-foreground p-1"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>

                    <div>
                      <p className="text-base leading-relaxed font-normal md:text-xs">{section.description}</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {affinityStyle && hasAffinity && (
        <span
          className={clsx(
            'ml-1 rounded border px-1.5 py-0.5 text-[10px] font-bold transition-all',
            affinityStyle.badgeClass,
            !isSelected && 'opacity-70 group-hover:opacity-100',
          )}
        >
          {Math.round(affinity as number)}%
        </span>
      )}

      {isSelected && (
        <motion.div
          layoutId="activeTab"
          className={clsx('absolute right-0 bottom-0 left-0 h-0.5', isOther ? 'bg-other-user' : 'bg-primary')}
        />
      )}
    </div>
  );
}

export function SectionTabs({
  sections,
  selectedId,
  onSelect,
  isLoading,
  affinityMap,
  variant = 'default',
}: SectionTabsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="border-border flex flex-wrap gap-2 border-b">
      {sections.map(sec => {
        let affinity: number | null | undefined = undefined;
        if (affinityMap) {
          affinity = affinityMap[sec.uuid];
          if (affinity === undefined && sec.uuid) {
            const simpleUuid = sec.uuid.replace(/-/g, '');
            affinity = affinityMap[simpleUuid];
          }
        }

        return (
          <SectionTab
            key={sec.uuid}
            section={sec}
            isSelected={selectedId === sec.uuid}
            onSelect={() => onSelect(sec.uuid)}
            affinity={affinity}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
