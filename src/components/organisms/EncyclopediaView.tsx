'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { UsersService } from '@/lib/client/services/UsersService';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import { Input } from '@/components/atoms/Input';
import { Dropdown } from '@/components/atoms/Dropdown';
import { IdeologyCard } from '@/components/molecules/IdeologyCard';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { Skeleton } from '@/components/atoms/Skeleton';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { useAuthStore } from '@/store/useAuthStore';

type SortOption = 'name_asc' | 'name_desc' | 'affinity_desc' | 'affinity_asc';

export function EncyclopediaView() {
  const t = useTranslations('Encyclopedia');
  const { isAuthenticated, user } = useAuthStore();
  const isVerified = user?.is_verified ?? false;

  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [affinities, setAffinities] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');

  const [selectedIdeology, setSelectedIdeology] = useState<IdeologyList | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;

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
        if (mounted) {
          setIdeologies(response.results);
        }
      } catch (error) {
        console.error('Failed to fetch ideologies', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch]);

  // Fetch affinities if authenticated AND verified
  useEffect(() => {
    if (isAuthenticated && isVerified && ideologies.length > 0) {
      let mounted = true;

      const fetchAffinities = async () => {
        const toFetch = ideologies.filter(i => affinities[i.uuid] === undefined);
        if (toFetch.length === 0) return;

        await Promise.all(
          toFetch.map(async ideology => {
            try {
              const data = await UsersService.usersAffinityIdeologyRetrieve(ideology.uuid);
              if (mounted) {
                setAffinities(prev => ({
                  ...prev,
                  [ideology.uuid]: data.total_affinity,
                }));
              }
            } catch (e) {
              console.error(`Failed to fetch affinity for ${ideology.name}`, e);
              if (mounted) {
                setAffinities(prev => ({ ...prev, [ideology.uuid]: null }));
              }
            }
          }),
        );
      };

      fetchAffinities();
      return () => {
        mounted = false;
      };
    }
  }, [isAuthenticated, isVerified, ideologies, affinities]);

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

  const sortedIdeologies = useMemo(() => {
    const items = [...ideologies];

    switch (sortBy) {
      case 'affinity_desc':
        return items.sort((a, b) => {
          const affA = affinities[a.uuid] ?? -1;
          const affB = affinities[b.uuid] ?? -1;
          if (affinities[a.uuid] === undefined) return 1;
          if (affinities[b.uuid] === undefined) return -1;
          return affB - affA;
        });
      case 'affinity_asc':
        return items.sort((a, b) => {
          const affA = affinities[a.uuid] ?? 999;
          const affB = affinities[b.uuid] ?? 999;
          if (affinities[a.uuid] === undefined) return 1;
          if (affinities[b.uuid] === undefined) return -1;
          return affA - affB;
        });
      case 'name_desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'name_asc':
      default:
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [ideologies, sortBy, affinities]);

  const canSortByAffinity = isAuthenticated && isVerified;
  const sortOptions: SortOption[] = canSortByAffinity
    ? ['name_asc', 'name_desc', 'affinity_desc', 'affinity_asc']
    : ['name_asc', 'name_desc'];

  const getSortLabel = (opt: string) => {
    return t(`sort_${opt}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <AnimatePresence>
        {selectedIdeology && <IdeologyDrawer ideology={selectedIdeology} onClose={() => setSelectedIdeology(null)} />}
      </AnimatePresence>

      <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center md:py-28">
        <MagneticBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 max-w-2xl space-y-6"
        >
          <h1 className="text-foreground text-4xl font-black tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg md:text-xl">{t('subtitle')}</p>

          <div className="relative z-50 mx-auto mt-8 flex w-full max-w-lg flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder={t('search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                startIcon={<span className="material-symbols-outlined text-[20px]">search</span>}
                className="bg-secondary/80 border-border focus:bg-secondary border shadow-xl backdrop-blur-md transition-all"
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <Dropdown
                value={getSortLabel(sortBy)}
                options={sortOptions.map(getSortLabel)}
                onChange={val => {
                  const key = sortOptions.find(k => getSortLabel(k) === val);
                  if (key) setSortBy(key);
                }}
                label={t('sort_label')}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-muted/30 relative z-10 min-h-screen border-t py-12">
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
          ) : sortedIdeologies.length > 0 ? (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {sortedIdeologies.map((ideology, index) => (
                  <IdeologyCard
                    key={ideology.uuid}
                    ideology={ideology}
                    index={index}
                    onClick={() => setSelectedIdeology(ideology)}
                    affinity={affinities[ideology.uuid]}
                    isLoading={canSortByAffinity && affinities[ideology.uuid] === undefined}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
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
