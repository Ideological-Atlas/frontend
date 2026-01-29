'use client';

import { Button } from '@/components/atoms/Button';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

interface SectionNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onStepClick: (index: number) => void;
  showNext: boolean;
  showPrevious: boolean;
  isNextLevel?: boolean;
  currentIndex: number;
  totalSteps: number;
  completedSteps?: boolean[];
}

export function SectionNavigation({
  onNext,
  onPrevious,
  onStepClick,
  showNext,
  showPrevious,
  isNextLevel = false,
  currentIndex,
  totalSteps,
  completedSteps = [],
}: SectionNavigationProps) {
  const t = useTranslations('Atlas');

  if (totalSteps <= 1 && !isNextLevel) return null;

  return (
    <div className="border-border mt-8 flex w-full items-center justify-between border-t pt-8">
      {/* Lado Izquierdo (Anterior) */}
      <div className="flex flex-1 justify-start">
        {showPrevious ? (
          <Button variant="secondary" onClick={onPrevious} className="h-10 gap-2 px-5 text-xs font-bold">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t('previous_label') || 'Anterior'}
          </Button>
        ) : (
          <div />
        )}
      </div>

      {/* Centro (Indicadores Interactivos) - Oculto en móvil */}
      <div className="hidden flex-wrap justify-center gap-3 px-4 md:flex">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = completedSteps[i] ?? false;
          const isActive = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => onStepClick(i)}
              aria-label={`Ir a la sección ${i + 1}`}
              className={clsx(
                'focus:ring-offset-background h-2.5 rounded-full transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                // Ring color
                isCompleted ? 'focus:ring-accent-strong/50' : 'focus:ring-primary/50',
                // Base styles depending on state
                isActive
                  ? clsx(
                      'w-10 cursor-default shadow-sm',
                      isCompleted ? 'bg-accent-strong shadow-accent-strong/30' : 'bg-primary shadow-primary/30',
                    )
                  : clsx(
                      'w-2.5 cursor-pointer hover:w-4',
                      isCompleted ? 'bg-accent-strong/60 hover:bg-accent-strong' : 'bg-primary/20 hover:bg-primary/50',
                    ),
              )}
            />
          );
        })}
      </div>

      {/* Lado Derecho (Siguiente) */}
      <div className="flex flex-1 justify-end">
        {showNext && (
          <Button
            variant={isNextLevel ? 'primary' : 'secondary'}
            onClick={onNext}
            className={clsx('h-10 gap-2 px-5 text-xs font-bold', isNextLevel && 'shadow-primary/20 shadow-lg')}
          >
            {isNextLevel ? t('next_level_label') || 'Siguiente Nivel' : t('next_section_label') || 'Siguiente Sección'}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        )}
      </div>
    </div>
  );
}
