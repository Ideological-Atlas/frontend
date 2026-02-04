'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/components/atoms/SmartLink';
import { Button } from '@/components/atoms/Button';

interface DiscoveryLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscoveryLockModal({ isOpen, onClose }: DiscoveryLockModalProps) {
  const t = useTranslations('Atlas');
  const locale = useLocale();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
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
            className="bg-card border-border relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>

              <h2 className="text-foreground mb-3 text-2xl font-bold">{t('discovery_lock_title')}</h2>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{t('discovery_lock_desc')}</p>

              <div className="flex w-full flex-col gap-3">
                <Link href={`/${locale}/login`} className="w-full">
                  <Button variant="primary" className="w-full shadow-lg">
                    {t('discovery_lock_login')}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  {t('discovery_lock_cancel')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
