'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { StructureService } from '@/lib/client/services/StructureService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { IdeologyAbstractionComplexity } from '@/lib/client/models/IdeologyAbstractionComplexity';
import type { IdeologyConditioner } from '@/lib/client/models/IdeologyConditioner';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { AxisCard } from '@/components/molecules/AxisCard';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';

export function AtlasView() {
  const t = useTranslations('Atlas');
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();

  const [complexities, setComplexities] = useState<IdeologyAbstractionComplexity[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);

  const [conditioners, setConditioners] = useState<IdeologyConditioner[]>([]);
  const [sections, setSections] = useState<IdeologySection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const [axes, setAxes] = useState<IdeologyAxis[]>([]);

  const [loadingComplexities, setLoadingComplexities] = useState(true);
  const [loadingLevelData, setLoadingLevelData] = useState(false);
  const [loadingAxes, setLoadingAxes] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingComplexities(true);

    const request = StructureService.structureComplexitiesList(100);

    request
      .then(response => {
        setComplexities(response.results);

        if (response.results.length > 0) {
          const sorted = [...response.results].sort((a, b) => a.complexity - b.complexity);
          setSelectedComplexity(prev => prev || sorted[0].uuid);
        }
        setLoadingComplexities(false);
      })
      .catch(error => {
        if (!error.isCancelled) {
          console.error('Failed to fetch complexities', error);
          setLoadingComplexities(false);
        }
      });

    return () => {
      request.cancel();
    };
  }, [locale]);

  useEffect(() => {
    if (!selectedComplexity) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingLevelData(true);
    setConditioners([]);
    setSections([]);
    setAxes([]);

    const reqConditioners = StructureService.structureConditionersList(selectedComplexity, 100);
    const reqSections = StructureService.structureSectionsList(selectedComplexity, 100);

    Promise.all([reqConditioners, reqSections])
      .then(([condResponse, secResponse]) => {
        setConditioners(condResponse.results);
        setSections(secResponse.results);

        if (secResponse.results.length > 0) {
          setSelectedSection(secResponse.results[0].uuid);
        } else {
          setSelectedSection(null);
        }
        setLoadingLevelData(false);
      })
      .catch(error => {
        if (!error.isCancelled) {
          console.error('Failed to fetch level data', error);
          setLoadingLevelData(false);
        }
      });

    return () => {
      reqConditioners.cancel();
      reqSections.cancel();
    };
  }, [selectedComplexity, locale]);

  useEffect(() => {
    if (!selectedSection) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingAxes(true);

    const request = StructureService.structureSectionsAxesList(selectedSection, 100);

    request
      .then(response => {
        setAxes(response.results);
        setLoadingAxes(false);
      })
      .catch(error => {
        if (!error.isCancelled) {
          console.error('Failed to fetch axes', error);
          setLoadingAxes(false);
        }
      });

    return () => {
      request.cancel();
    };
  }, [selectedSection, locale]);

  const handleSaveAnswer = async (axisUuid: string, value: number) => {
    if (!isAuthenticated) return;

    try {
      await AnswersService.answersAxisCreate(axisUuid, { value });
    } catch (error) {
      console.error('Error saving answer', error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 pb-20">
      <section className="border-border bg-card/50 border-b px-5 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
          <h2 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">{t('complexity_level')}</h2>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            {loadingComplexities
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32 shrink-0 rounded-full" />
                ))
              : complexities.map(c => (
                  <Button
                    key={c.uuid}
                    variant={selectedComplexity === c.uuid ? 'primary' : 'secondary'}
                    onClick={() => setSelectedComplexity(c.uuid)}
                    className="shrink-0 rounded-full"
                  >
                    {c.name}
                  </Button>
                ))}
          </div>
        </div>
      </section>

      <div className="layout-content-container mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 md:px-20">
        {loadingLevelData ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : conditioners.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border bg-card rounded-xl border p-6 shadow-sm"
          >
            <h3 className="text-foreground mb-4 text-lg font-bold">{t('context_configuration')}</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {conditioners.map(cond => (
                <div key={cond.uuid} className="flex flex-col gap-2">
                  <label className="text-foreground text-sm font-medium">{cond.name}</label>
                  <div className="border-border bg-secondary text-muted-foreground flex h-10 items-center justify-center rounded-lg border text-sm">
                    {t('selector_placeholder', { type: cond.type ?? 'unknown' })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-6">
          {loadingLevelData ? (
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          ) : (
            <div className="border-border flex flex-wrap gap-2 border-b">
              {sections.map(sec => (
                <button
                  key={sec.uuid}
                  onClick={() => setSelectedSection(sec.uuid)}
                  className={clsx(
                    'relative px-6 py-3 text-sm font-medium transition-colors',
                    selectedSection === sec.uuid ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {sec.name}
                  {selectedSection === sec.uuid && (
                    <motion.div layoutId="activeTab" className="bg-primary absolute right-0 bottom-0 left-0 h-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {loadingAxes ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
            ) : axes.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSection}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-6"
                >
                  {axes.map(axis => (
                    <AxisCard key={axis.uuid} axis={axis} onSave={handleSaveAnswer} defaultValue={0} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              !loadingLevelData && (
                <div className="border-border bg-secondary/20 flex h-40 items-center justify-center rounded-xl border border-dashed">
                  <p className="text-muted-foreground">{t('no_questions')}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
