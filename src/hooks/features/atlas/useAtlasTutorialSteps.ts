import { DriveStep } from 'driver.js';

interface TutorialCallbacks {
  onToggleHeader: (action: 'expand' | 'collapse') => void;
  onSimulateAction: (type: 'move' | 'margin') => void;
}

export const getTutorialSteps = (t: (key: string) => string, callbacks: TutorialCallbacks): DriveStep[] => {
  return [
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
        callbacks.onToggleHeader('expand');
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
        callbacks.onToggleHeader('collapse');
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
        setTimeout(() => callbacks.onSimulateAction('move'), 500);
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
        setTimeout(() => callbacks.onSimulateAction('margin'), 500);
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
      element: '#atlas-discovery-btn',
      popover: {
        title: t('tour.discovery.title'),
        description: t('tour.discovery.desc'),
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
};
