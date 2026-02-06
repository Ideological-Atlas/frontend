'use client';

import { useTranslations } from 'next-intl';
import { ExploreIdeologyButton } from './ExploreIdeologyButton';

interface IdeologyDrawerFooterProps {
  onClose: () => void;
  showExploreAction: boolean;
  uuid: string;
}

export function IdeologyDrawerFooter({ onClose, showExploreAction, uuid }: IdeologyDrawerFooterProps) {
  const t = useTranslations('Encyclopedia');

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="text-xs font-bold text-zinc-500 uppercase transition-colors hover:text-white"
        >
          {t('close')}
        </button>

        {showExploreAction && <ExploreIdeologyButton uuid={uuid} />}
      </div>
    </div>
  );
}
