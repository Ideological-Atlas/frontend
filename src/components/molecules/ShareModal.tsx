'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
  const t = useTranslations('Atlas');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
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
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <h2 className="text-foreground text-xl font-bold">{t('share_posture_title') || 'Compartir Postura'}</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{t('share_posture_description')}</p>

              <div className="mb-2">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {t('direct_link_label')}
                </span>
              </div>

              <div className="flex gap-2">
                <div className="bg-secondary text-foreground flex-1 truncate rounded-lg border border-white/5 px-4 py-3 text-sm font-medium">
                  {shareUrl}
                </div>
                <Button
                  onClick={handleCopy}
                  variant="primary"
                  className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? t('copied') : t('copy')}
                </Button>
              </div>

              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm font-medium text-green-500"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {t('link_copied_success')}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
