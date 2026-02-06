'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import { UsersService } from '@/lib/client/services/UsersService';
import { Button } from '@/components/atoms/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { getTutorialSteps } from '@/hooks/features/atlas/useAtlasTutorialSteps';

export function AtlasOnboarding() {
  const t = useTranslations('Onboarding');
  const tAtlas = useTranslations('Atlas');

  const { user, isAuthenticated, setUser } = useAuthStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const driverObj = useRef<ReturnType<typeof driver> | null>(null);

  const getFirstAxisUuid = useCallback(() => {
    const { complexities, sections, axes } = useAtlasStore.getState();
    try {
      if (complexities.length > 0) {
        const sorted = [...complexities].sort((a, b) => a.complexity - b.complexity);
        const firstComp = sorted[0].uuid;
        const compSecs = sections[firstComp];
        if (compSecs && compSecs.length > 0) {
          const firstSec = compSecs[0].uuid;
          const secAxes = axes[firstSec];
          if (secAxes && secAxes.length > 0) return secAxes[0].uuid;
        }
      }
      const all = Object.values(axes).flat();
      if (all.length > 0) return all[0].uuid;
    } catch (e) {
      console.error(e);
    }
    return null;
  }, []);

  const simulateAction = useCallback(
    (type: 'move' | 'margin' | 'reset') => {
      const uuid = getFirstAxisUuid();
      if (!uuid) return;
      const authState = useAuthStore.getState();
      const isVerified = authState.user?.is_verified ?? false;

      if (type === 'move') {
        useAtlasStore
          .getState()
          .saveAnswer(
            uuid,
            { value: 85, margin_left: 50, margin_right: 10, is_indifferent: false },
            authState.isAuthenticated,
            isVerified,
          );
      } else if (type === 'margin') {
        useAtlasStore
          .getState()
          .saveAnswer(
            uuid,
            { value: -60, margin_left: 20, margin_right: 20, is_indifferent: false },
            authState.isAuthenticated,
            isVerified,
          );
      } else {
        useAtlasStore.getState().deleteAnswer(uuid, authState.isAuthenticated, isVerified);
      }
    },
    [getFirstAxisUuid],
  );

  const toggleHeaderDescription = useCallback((action: 'expand' | 'collapse') => {
    const btn = document.getElementById('atlas-header-toggle');
    if (btn) {
      const currentLabel = btn.getAttribute('aria-label');
      const isExpanded = currentLabel === 'Collapse description';
      if ((action === 'expand' && !isExpanded) || (action === 'collapse' && isExpanded)) {
        btn.click();
        setTimeout(() => driverObj.current?.refresh(), 400);
      }
    }
  }, []);

  const startTour = useCallback(() => {
    if (driverObj.current?.isActive()) return;

    const steps = getTutorialSteps(t, {
      onToggleHeader: toggleHeaderDescription,
      onSimulateAction: simulateAction,
    });

    driverObj.current = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      popoverClass: 'driverjs-theme',
      doneBtnText: t('buttons.done'),
      nextBtnText: t('buttons.next'),
      prevBtnText: t('buttons.prev'),
      progressText: '{{current}} / {{total}}',
      steps,
      onDestroyStarted: () => {
        simulateAction('reset');
        if (isAuthenticated && user && !user.atlas_onboarding_completed) {
          UsersService.mePartialUpdate({ atlas_onboarding_completed: true })
            .then(updated => setUser(updated))
            .catch(console.error);
        }
        driverObj.current?.destroy();
      },
    });

    driverObj.current.drive();
  }, [t, isAuthenticated, user, setUser, simulateAction, toggleHeaderDescription]);

  useEffect(() => {
    const handleManualStart = () => startTour();
    window.addEventListener('start-atlas-tour', handleManualStart);

    const checkOnboardingStatus = async () => {
      if (isAuthenticated && user) {
        if (user.atlas_onboarding_completed === false) {
          setShowWelcomeModal(true);
        }
      } else if (!isAuthenticated) {
        const hasSeenWelcome = localStorage.getItem('atlas_welcome_seen');
        if (!hasSeenWelcome) {
          setShowWelcomeModal(true);
        }
      }
    };

    const timer = setTimeout(() => checkOnboardingStatus(), 800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('start-atlas-tour', handleManualStart);
      if (driverObj.current) driverObj.current.destroy();
    };
  }, [isAuthenticated, user, startTour]);

  const markAsSeen = () => {
    if (isAuthenticated) {
      UsersService.mePartialUpdate({ atlas_onboarding_completed: true })
        .then(updated => setUser(updated))
        .catch(console.error);
    } else {
      localStorage.setItem('atlas_welcome_seen', 'true');
    }
  };

  const handleStartTutorial = () => {
    markAsSeen();
    setShowWelcomeModal(false);
    setTimeout(() => startTour(), 300);
  };

  const handleSkipTutorial = () => {
    markAsSeen();
    setShowWelcomeModal(false);
  };

  return (
    <AnimatePresence>
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWelcomeModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card text-card-foreground border-border relative w-full max-w-sm overflow-hidden rounded-2xl border p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 text-primary mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-[32px]">school</span>
              </div>

              <h2 className="text-foreground mb-2 text-2xl font-black tracking-tight">
                {tAtlas('welcome_modal.title')}
              </h2>

              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                {tAtlas('welcome_modal.description')}
              </p>

              {!isAuthenticated && (
                <div className="bg-secondary/50 mb-6 w-full rounded-lg p-3 text-xs font-medium text-amber-600 dark:text-amber-500">
                  <span className="material-symbols-outlined mr-1 inline-block align-middle text-[14px]">warning</span>
                  {tAtlas('welcome_modal.guest_note')}
                </div>
              )}

              <div className="flex w-full flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartTutorial}
                  className="shadow-primary/20 w-full shadow-lg"
                >
                  {tAtlas('welcome_modal.start_btn')}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSkipTutorial}
                  className="text-muted-foreground hover:text-foreground w-full"
                >
                  {tAtlas('welcome_modal.skip_btn')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
