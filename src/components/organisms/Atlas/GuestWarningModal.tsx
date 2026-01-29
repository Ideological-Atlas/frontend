'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/atoms/Button';

export function GuestWarningModal() {
  const t = useTranslations('Atlas');
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const hasSeenWarning = sessionStorage.getItem('atlas_guest_warning_seen');
      if (!hasSeenWarning) {
        // Usamos setTimeout para evitar la actualización síncrona dentro del efecto
        const timer = setTimeout(() => setIsOpen(true), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('atlas_guest_warning_seen', 'true');
    setIsOpen(false);
    window.dispatchEvent(new Event('guest-warning-dismissed'));
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
            <div className="bg-destructive/5 flex flex-col items-center p-8 text-center">
              <div className="bg-destructive/10 text-destructive mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>

              <h2 className="text-foreground mb-3 text-2xl font-bold">{t('guest_warning.title')}</h2>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{t('guest_warning.description')}</p>

              <div className="flex w-full flex-col gap-3">
                <Link href={`/${locale}/login`} className="w-full">
                  <Button variant="primary" className="w-full shadow-lg">
                    {t('guest_warning.login')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleContinueAsGuest}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t('guest_warning.continue_guest')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
