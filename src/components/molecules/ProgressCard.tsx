'use client';

import { clsx } from 'clsx';
import { Button } from '@/components/atoms/Button';
import { useTranslations } from 'next-intl';

interface ProgressCardProps {
  label: string;
  percentage: number;
  className?: string;
  onShare?: () => void;
  isSharing?: boolean;
  variant?: 'default' | 'other';
}

export function ProgressCard({
  label,
  percentage,
  className,
  onShare,
  isSharing,
  variant = 'default',
}: ProgressCardProps) {
  const t = useTranslations('Atlas');
  const isOther = variant === 'other';

  return (
    <div className={clsx('bg-card border-border flex flex-col gap-5 rounded-2xl border p-5 shadow-sm', className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">{label}</span>
          <span className={clsx('text-lg font-black', isOther ? 'text-other-user' : 'text-primary')}>
            {percentage}%
          </span>
        </div>
        <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-700 ease-out',
              isOther ? 'bg-other-user' : 'bg-primary',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {onShare && (
        <div id="atlas-share-btn">
          <Button
            variant="outline"
            className="border-border hover:bg-secondary w-full"
            onClick={onShare}
            isLoading={isSharing}
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">share</span>
            {t('share_button') || 'Compartir'}
          </Button>
        </div>
      )}
    </div>
  );
}
