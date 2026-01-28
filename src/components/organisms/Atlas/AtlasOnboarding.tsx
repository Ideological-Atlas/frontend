'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import { UsersService } from '@/lib/client/services/UsersService';
import { Button } from '@/components/atoms/Button';
import { AnimatePresence, motion } from 'framer-motion';

export function AtlasOnboarding() {
  const t = useTranslations('Onboarding');
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const driverObj = useRef<ReturnType<typeof driver> | null>(null);

  const handleComplete = useCallback(async () => {
    if (isAuthenticated && user && !user.atlas_onboarding_completed) {
      try {
        const updated = await UsersService.mePartialUpdate({
          atlas_onboarding_completed: true,
        });
        setUser(updated);
      } catch (error) {
        console.error('Error updating onboarding status', error);
      }
    }
    if (!isAuthenticated) {
      localStorage.setItem('atlas_guest_prompt_seen', 'true');
    }
  }, [isAuthenticated, user, setUser]);

  const getFirstAxisUuid = useCallback(() => {
    const { complexities, sections, axes } = useAtlasStore.getState();
    try {
      if (complexities.length > 0) {
        const sortedComplexities = [...complexities].sort((a, b) => a.complexity - b.complexity);
        const firstCompId = sortedComplexities[0].uuid;
        const compSections = sections[firstCompId];

        if (compSections && compSections.length > 0) {
          const firstSecId = compSections[0].uuid;
          const secAxes = axes[firstSecId];
          if (secAxes && secAxes.length > 0) {
            return secAxes[0].uuid;
          }
        }
      }
      const allAxes = Object.values(axes).flat();
      if (allAxes.length > 0) return allAxes[0].uuid;
    } catch (e) {
      console.error('Error buscando axis UUID', e);
    }
    return null;
  }, []);

  const simulateAxisMove = useCallback(() => {
    const axisUuid = getFirstAxisUuid();
    if (axisUuid) {
      const { saveAnswer } = useAtlasStore.getState();
      const isAuth = useAuthStore.getState().isAuthenticated;
      saveAnswer(axisUuid, { value: 85, margin_left: 50, margin_right: 10, is_indifferent: false }, isAuth);
    }
  }, [getFirstAxisUuid]);

  const simulateMarginMove = useCallback(() => {
    const axisUuid = getFirstAxisUuid();
    if (axisUuid) {
      const { saveAnswer } = useAtlasStore.getState();
      const isAuth = useAuthStore.getState().isAuthenticated;
      saveAnswer(axisUuid, { value: -60, margin_left: 20, margin_right: 20, is_indifferent: false }, isAuth);
    }
  }, [getFirstAxisUuid]);

  const toggleHeaderDescription = useCallback((action: 'expand' | 'collapse') => {
    const btn = document.getElementById('atlas-header-toggle');
    if (btn) {
      const currentLabel = btn.getAttribute('aria-label');
      const isExpanded = currentLabel === 'Collapse description';

      if ((action === 'expand' && !isExpanded) || (action === 'collapse' && isExpanded)) {
        btn.click();

        setTimeout(() => {
          if (driverObj.current) {
            driverObj.current.refresh();
          }
        }, 400);
      }
    }
  }, []);

  const resetSimulation = useCallback(() => {
    const axisUuid = getFirstAxisUuid();
    if (axisUuid) {
      const { deleteAnswer } = useAtlasStore.getState();
      const isAuth = useAuthStore.getState().isAuthenticated;
      deleteAnswer(axisUuid, isAuth);
    }
  }, [getFirstAxisUuid]);

  const startTour = useCallback(() => {
    if (driverObj.current && driverObj.current.isActive()) return;

    const steps: DriveStep[] = [
      {
        popover: {
          title: t('tour.welcome.title'),
          description: t('tour.welcome.desc'),
        },
      },
      {
        element: '#atlas-sidebar',
        popover: {
          title: t('tour.levels.title'),
          description: t('tour.levels.desc'),
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#atlas-progress-card',
        popover: {
          title: t('tour.progress.title'),
          description: t('tour.progress.desc'),
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '#atlas-header',
        popover: {
          title: t('tour.header.title'),
          description: t('tour.header.desc'),
          side: 'bottom',
          align: 'center',
        },
        onHighlightStarted: () => {
          toggleHeaderDescription('expand');
        },
      },
      {
        element: '#atlas-header-toggle',
        popover: {
          title: t('tour.header_toggle.title'),
          description: t('tour.header_toggle.desc'),
          side: 'bottom',
          align: 'center',
        },
        onHighlightStarted: () => {
          toggleHeaderDescription('collapse');
        },
      },
      {
        element: '#atlas-sections',
        popover: {
          title: t('tour.sections.title'),
          description: t('tour.sections.desc'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#atlas-section-help-0',
        popover: {
          title: t('tour.section_help.title'),
          description: t('tour.section_help.desc'),
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#atlas-first-axis',
        popover: {
          title: t('tour.axis.title'),
          description: t('tour.axis.desc'),
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '#atlas-axis-title',
        popover: {
          title: t('tour.axis_title.title'),
          description: t('tour.axis_title.desc'),
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#atlas-axis-help',
        popover: {
          title: t('tour.axis_help.title'),
          description: t('tour.axis_help.desc'),
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '#atlas-axis-indifferent',
        popover: {
          title: t('tour.axis_indifferent.title'),
          description: t('tour.axis_indifferent.desc'),
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '#atlas-axis-slider',
        popover: {
          title: t('tour.slider_value.title'),
          description: t('tour.slider_value.desc'),
          side: 'top',
          align: 'center',
        },
        onHighlightStarted: () => {
          setTimeout(() => simulateAxisMove(), 500);
        },
      },
      {
        element: '#atlas-axis-slider',
        popover: {
          title: t('tour.slider_margin.title'),
          description: t('tour.slider_margin.desc'),
          side: 'bottom',
          align: 'center',
        },
        onHighlightStarted: () => {
          setTimeout(() => simulateMarginMove(), 500);
        },
      },
      {
        element: '#atlas-progress-card',
        popover: {
          title: t('tour.complete_level.title'),
          description: t('tour.complete_level.desc'),
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '#atlas-share-btn',
        popover: {
          title: t('tour.share.title'),
          description: t('tour.share.desc'),
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '#atlas-view-container',
        popover: {
          title: t('tour.finish.title'),
          description: t('tour.finish.desc'),
          side: 'bottom',
          align: 'center',
        },
      },
    ];

    driverObj.current = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      popoverClass: 'driverjs-theme',
      doneBtnText: t('buttons.done'),
      nextBtnText: t('buttons.next'),
      prevBtnText: t('buttons.prev'),
      progressText: '{{current}} / {{total}}',
      steps: steps,
      onDestroyStarted: () => {
        resetSimulation();
        handleComplete();
        driverObj.current?.destroy();
      },
    });

    driverObj.current.drive();
  }, [t, handleComplete, simulateAxisMove, simulateMarginMove, toggleHeaderDescription, resetSimulation]);

  useEffect(() => {
    const handleStartTour = () => startTour();
    window.addEventListener('start-atlas-tour', handleStartTour);

    const handleGuestWarningDismissed = () => {
      const hasSeenGuestPrompt = localStorage.getItem('atlas_guest_prompt_seen');
      if (!hasSeenGuestPrompt) {
        setTimeout(() => setShowGuestPrompt(true), 500);
      }
    };
    window.addEventListener('guest-warning-dismissed', handleGuestWarningDismissed);

    if (isAuthenticated && user) {
      if (user.atlas_onboarding_completed === false) {
        startTour();
      }
    }

    return () => {
      window.removeEventListener('start-atlas-tour', handleStartTour);
      window.removeEventListener('guest-warning-dismissed', handleGuestWarningDismissed);
      if (driverObj.current) {
        driverObj.current.destroy();
      }
    };
  }, [isAuthenticated, user, startTour]);

  return (
    <>
      <AnimatePresence>
        {showGuestPrompt && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-0 left-0 z-[100] mx-auto w-full max-w-md px-4"
          >
            <div className="bg-card text-card-foreground border-border flex items-center justify-between gap-4 rounded-xl border p-4 shadow-xl">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{t('guest_prompt.title')}</span>
                <span className="text-muted-foreground text-xs">{t('guest_prompt.subtitle')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowGuestPrompt(false)}>
                  {t('guest_prompt.no')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowGuestPrompt(false);
                    startTour();
                  }}
                >
                  {t('guest_prompt.yes')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
