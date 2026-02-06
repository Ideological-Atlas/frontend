'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { IdeologyBadge } from './IdeologyBadge';

interface IdeologyDrawerHeaderProps {
  ideology: IdeologyList;
  onClose: () => void;
}

const MASK_STYLE = {
  maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
};

export function IdeologyDrawerHeader({ ideology, onClose }: IdeologyDrawerHeaderProps) {
  const t = useTranslations('Encyclopedia');
  const bgColor = ideology.color || '#64748b';

  return (
    <div className="relative h-64 w-full shrink-0 overflow-hidden bg-zinc-950">
      <div
        className="absolute inset-0 z-0 opacity-60 transition-colors duration-700"
        style={{ backgroundColor: bgColor }}
      />

      {ideology.flag && (
        <div className="absolute inset-0 z-10 h-full w-full" style={MASK_STYLE}>
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
          <IdeologyBadge>{t('ideology_tag')}</IdeologyBadge>

          {ideology.associated_countries.map(c => (
            <IdeologyBadge key={c.id} icon="public">
              {c.name}
            </IdeologyBadge>
          ))}
        </div>

        <h2 className="text-4xl leading-none font-black tracking-tight text-white drop-shadow-xl md:text-5xl">
          {ideology.name}
        </h2>
      </div>
    </div>
  );
}
