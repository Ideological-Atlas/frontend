'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';

interface ComplexitySelectorProps {
  complexities: IdeologyAbstractionComplexity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export function ComplexitySelector({ complexities, selectedId, onSelect, isLoading }: ComplexitySelectorProps) {
  const t = useTranslations('Atlas');

  return (
    <section className="border-border bg-card/50 border-b px-5 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
        <h2 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">{t('complexity_level')}</h2>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-32 shrink-0 rounded-full" />)
            : complexities.map(c => (
                <Button
                  key={c.uuid}
                  variant={selectedId === c.uuid ? 'primary' : 'secondary'}
                  onClick={() => onSelect(c.uuid)}
                  className="shrink-0 rounded-full"
                >
                  {c.name}
                </Button>
              ))}
        </div>
      </div>
    </section>
  );
}
