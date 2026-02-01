'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { Input } from '@/components/atoms/Input';
import { IdeologyCard } from '@/components/molecules/IdeologyCard';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { Skeleton } from '@/components/atoms/Skeleton';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';

export function EncyclopediaView() {
  const t = useTranslations('Encyclopedia');
  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedIdeology, setSelectedIdeology] = useState<IdeologyList | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await IdeologiesService.ideologiesList(
          undefined,
          100,
          0,
          undefined,
          undefined,
          debouncedSearch || undefined,
        );
        setIdeologies(response.results);
      } catch (error) {
        console.error('Failed to fetch ideologies', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedIdeology) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIdeology]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <AnimatePresence>
        {selectedIdeology && <IdeologyDrawer ideology={selectedIdeology} onClose={() => setSelectedIdeology(null)} />}
      </AnimatePresence>

      <div className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center md:py-28">
        <MagneticBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl space-y-6"
        >
          <h1 className="text-foreground text-4xl font-black tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg md:text-xl">{t('subtitle')}</p>

          <div className="mx-auto mt-8 w-full max-w-md">
            <Input
              placeholder={t('search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              startIcon={<span className="material-symbols-outlined text-[20px]">search</span>}
              className="bg-secondary/80 border-border focus:bg-secondary border shadow-xl backdrop-blur-md transition-all"
            />
          </div>
        </motion.div>
      </div>

      <div className="bg-muted/30 min-h-screen border-t py-12">
        <div className="layout-content-container mx-auto w-full max-w-[1400px] px-5 md:px-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-2xl border p-4">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : ideologies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ideologies.map((ideology, index) => (
                <IdeologyCard
                  key={ideology.uuid}
                  ideology={ideology}
                  index={index}
                  onClick={() => setSelectedIdeology(ideology)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-60 flex-col items-center justify-center gap-4 text-center">
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-muted-foreground text-3xl">search_off</span>
              </div>
              <p className="text-muted-foreground font-medium">{t('no_results')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
