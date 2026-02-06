import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';

interface DiscoveryHeaderProps {
  winner: IdeologyList;
}

export function DiscoveryHeader({ winner }: DiscoveryHeaderProps) {
  const t = useTranslations('Atlas');

  return (
    <div className="bg-muted relative h-40 w-full shrink-0 overflow-hidden">
      <div className="absolute inset-0 opacity-60" style={{ backgroundColor: winner.color || 'var(--muted)' }} />
      {winner.flag && (
        <Image
          src={winner.flag}
          alt={winner.name}
          fill
          className="object-cover opacity-50 mix-blend-overlay"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="absolute bottom-6 left-0 w-full text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white"
        >
          <span className="material-symbols-outlined text-gold mb-2 text-5xl drop-shadow-lg">emoji_events</span>
          <h2 className="text-3xl font-black tracking-tight drop-shadow-md">{t('discovery_modal_title')}</h2>
        </motion.div>
      </div>
    </div>
  );
}
