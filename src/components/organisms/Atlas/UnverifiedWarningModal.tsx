'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/atoms/Button';

export function UnverifiedWarningModal() {
  const t = useTranslations('Atlas');
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.is_verified) {
      const hasSeenWarning = sessionStorage.getItem('atlas_unverified_warning_seen');
      if (!hasSeenWarning) {
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const handleDismiss = () => {
    sessionStorage.setItem('atlas_unverified_warning_seen', 'true');
    setIsOpen(false);
    window.dispatchEvent(new Event('unverified-warning-dismissed'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card border-border relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="flex flex-col items-center bg-amber-500/5 p-8 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <span className="material-symbols-outlined text-[32px]">cloud_off</span>
              </div>

              <h2 className="text-foreground mb-3 text-2xl font-bold">{t('unverified_warning.title')}</h2>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                {t('unverified_warning.description')}
              </p>

              <div className="flex w-full justify-center">
                <Button variant="primary" onClick={handleDismiss} className="w-full shadow-lg">
                  {t('unverified_warning.dismiss')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
