'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';

interface IncompleteLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onSelectSection: (uuid: string) => void;
  incompleteSections: IdeologySection[];
}

export function IncompleteLevelModal({
  isOpen,
  onClose,
  onContinue,
  onSelectSection,
  incompleteSections,
}: IncompleteLevelModalProps) {
  const t = useTranslations('Atlas');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card border-border relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="flex flex-col p-6 md:p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center self-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <span className="material-symbols-outlined text-[32px]">assignment_late</span>
              </div>

              <h2 className="text-foreground mb-3 text-center text-2xl font-bold">{t('incomplete_modal_title')}</h2>
              <p className="text-muted-foreground mb-8 text-center text-sm leading-relaxed">
                {t('incomplete_modal_description')}
              </p>

              <div className="scrollbar-thin mb-8 flex max-h-[300px] flex-col gap-3 overflow-y-auto pr-1">
                {incompleteSections.map(section => (
                  <button
                    key={section.uuid}
                    onClick={() => onSelectSection(section.uuid)}
                    className="bg-secondary/30 hover:bg-secondary hover:border-primary/30 group flex w-full items-center justify-between rounded-xl border border-transparent p-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-background text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                        {section.name.charAt(0)}
                      </div>
                      <span className="text-foreground text-left text-sm font-medium">{section.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary text-[20px] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="ghost"
                  onClick={onContinue}
                  className="text-muted-foreground hover:text-destructive order-2 sm:order-1 sm:flex-1"
                >
                  {t('incomplete_modal_continue')}
                </Button>
                <Button variant="primary" onClick={onClose} className="order-1 shadow-lg sm:order-2 sm:flex-1">
                  {t('incomplete_modal_cancel')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
