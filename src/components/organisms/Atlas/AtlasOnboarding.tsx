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

      saveAnswer(
        axisUuid,
        {
          value: -60,
          margin_left: 20,
          margin_right: 20,
          is_indifferent: false,
        },
        isAuth,
      );
    }
  }, [getFirstAxisUuid]);

  const startTour = useCallback(() => {
    if (driverObj.current && driverObj.current.isActive()) return;

    const steps: DriveStep[] = [
      {
        element: '#atlas-view-container',
        popover: {
          title: t('tour.welcome.title'),
          description: t('tour.welcome.desc'),
          side: 'bottom',
          align: 'center',
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
          setTimeout(() => {
            simulateAxisMove();
          }, 500);
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
      doneBtnText: t('buttons.done'),
      nextBtnText: t('buttons.next'),
      prevBtnText: t('buttons.prev'),
      progressText: '{{current}} / {{total}}',
      steps: steps,
      onDestroyStarted: () => {
        handleComplete();
        driverObj.current?.destroy();
      },
    });

    driverObj.current.drive();
  }, [t, handleComplete, simulateAxisMove]);

  useEffect(() => {
    const handleStartTour = () => startTour();
    window.addEventListener('start-atlas-tour', handleStartTour);

    if (isAuthenticated && user) {
      if (user.atlas_onboarding_completed === false) {
        startTour();
      }
    } else if (!isAuthenticated) {
      const hasSeenGuestPrompt = localStorage.getItem('atlas_guest_prompt_seen');
      if (!hasSeenGuestPrompt) {
        setTimeout(() => setShowGuestPrompt(true), 0);
      }
    }

    return () => {
      window.removeEventListener('start-atlas-tour', handleStartTour);
      if (driverObj.current) {
        driverObj.current.destroy();
      }
    };
  }, [isAuthenticated, user, startTour]);

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        .driver-popover.driverjs-theme {
          background-color: var(--card) !important;
          color: var(--card-foreground) !important;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 350px;
        }

        .driver-popover.driverjs-theme .driver-popover-title {
          font-family: var(--font-inter), sans-serif;
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 8px;
          color: var(--foreground) !important;
        }

        .driver-popover.driverjs-theme .driver-popover-description {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--muted-foreground) !important;
          margin-bottom: 20px;
        }

        .driver-popover.driverjs-theme .driver-popover-footer button {
          background-color: var(--secondary) !important;
          color: var(--secondary-foreground) !important;
          border: 1px solid var(--border) !important;
          text-shadow: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .driver-popover.driverjs-theme .driver-popover-footer button:hover {
          background-color: var(--primary) !important;
          color: var(--primary-foreground) !important;
          border-color: var(--primary) !important;
        }

        .driver-popover.driverjs-theme .driver-popover-close-btn {
          color: var(--muted-foreground) !important;
          top: 16px;
          right: 16px;
          font-size: 24px;
          font-weight: 300;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent !important;
        }

        .driver-popover.driverjs-theme .driver-popover-close-btn:hover {
          color: var(--destructive) !important;
        }

        .driver-popover.driverjs-theme .driver-popover-progress-text {
          color: var(--muted-foreground) !important;
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>

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
