'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAtlasStore } from '@/store/useAtlasStore';
import type { IdeologyAxisConditioner } from '@/lib/client/models/IdeologyAxisConditioner';
import type { IdeologyConditionerConditioner } from '@/lib/client/models/IdeologyConditionerConditioner';

type DependencyRule = IdeologyAxisConditioner | IdeologyConditionerConditioner;

interface DependencyBadgeProps {
  rules: DependencyRule[];
}

export function DependencyBadge({ rules }: DependencyBadgeProps) {
  const t = useTranslations('Atlas');
  const { conditioners } = useAtlasStore();

  const dependencyNames = useMemo(() => {
    if (!rules || rules.length === 0) return [];

    const allConditioners = Object.values(conditioners).flat();

    return rules
      .map(rule => {
        if ('conditioner' in rule && rule.conditioner?.name) {
          return rule.conditioner.name;
        }

        if ('source_conditioner_uuid' in rule) {
          const found = allConditioners.find(c => c.uuid === rule.source_conditioner_uuid);
          return found?.name || rule.source_conditioner_uuid;
        }

        return 'Unknown';
      })
      .filter(Boolean);
  }, [rules, conditioners]);

  if (dependencyNames.length === 0) return null;

  return (
    <div className="group absolute top-0 right-0 z-40">
      <div className="text-primary-foreground flex h-7 cursor-help items-center justify-center rounded-tr-xl rounded-bl-xl bg-[var(--strong-accent)] px-3 text-[10px] font-black tracking-widest uppercase shadow-sm transition-colors hover:brightness-110">
        {t('conditioned_label')}
      </div>

      <div className="border-border/50 invisible absolute top-full right-0 z-50 mt-1 w-64 origin-top-right rounded-xl border bg-zinc-950 p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
          <span className="material-symbols-outlined text-[16px] text-[var(--strong-accent)]">link</span>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            {t('depends_on_label')}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {dependencyNames.map((name, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-medium text-zinc-100">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current text-[var(--strong-accent)]" />
              <span className="leading-tight">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
