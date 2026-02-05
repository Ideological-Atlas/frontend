import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

interface ExpandableDescriptionProps {
  text: string | null | undefined;
  id: string;
}

export function ExpandableDescription({ text, id }: ExpandableDescriptionProps) {
  const t = useTranslations('Atlas');
  const tEnc = useTranslations('Encyclopedia');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative mb-6 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={clsx(
              'relative transition-all duration-300',
              !isExpanded && 'max-h-[140px] overflow-hidden md:max-h-none md:overflow-visible',
            )}
          >
            <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
              {text || tEnc('no_description')}
            </p>
            {!isExpanded && (
              <div className="from-card absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t to-transparent md:hidden" />
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary mt-2 text-xs font-bold tracking-wider uppercase hover:underline md:hidden"
          >
            {isExpanded ? t('read_less') : t('read_more')}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
