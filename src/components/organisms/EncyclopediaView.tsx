'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { GeographyService } from '@/lib/client/services/GeographyService';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import type { IdeologyAffinity } from '@/lib/client/models/IdeologyAffinity';
import type { Country } from '@/lib/client/models/Country';
import type { Region } from '@/lib/client/models/Region';
import type { Religion } from '@/lib/client/models/Religion';
import type { Tag } from '@/lib/client/models/Tag';
import { Input } from '@/components/atoms/Input';
import { Dropdown } from '@/components/atoms/Dropdown';
import { Button } from '@/components/atoms/Button';
import { IdeologyCard } from '@/components/molecules/IdeologyCard';
import { IdeologyDrawer } from '@/components/molecules/IdeologyDrawer';
import { Skeleton } from '@/components/atoms/Skeleton';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';

type SortOption = 'name_asc' | 'name_desc' | 'affinity_desc' | 'affinity_asc';

export function EncyclopediaView() {
  const t = useTranslations('Encyclopedia');
  const tCommon = useTranslations('Common');
  const { isAuthenticated, user } = useAuthStore();
  const { answers, conditionerAnswers, tempCompletedAnswerUuid, setTempCompletedAnswerUuid } = useAtlasStore();
  const isVerified = user?.is_verified ?? false;

  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [affinities, setAffinities] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');

  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedIdeology, setSelectedIdeology] = useState<IdeologyList | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const hasLocalAnswers = useMemo(() => {
    return Object.keys(answers).length > 0 || Object.keys(conditionerAnswers).length > 0;
  }, [answers, conditionerAnswers]);

  const canCalculateAffinity = (isAuthenticated && isVerified) || hasLocalAnswers;

  const calculateBestAffinity = (data: IdeologyAffinity): number | null => {
    if (data.total_affinity !== null && data.total_affinity !== undefined) {
      return data.total_affinity;
    }
    if (data.complexities && data.complexities.length > 0) {
      const sorted = [...data.complexities].sort(
        (a, b) => (b.complexity?.complexity ?? 0) - (a.complexity?.complexity ?? 0),
      );
      const match = sorted.find(c => c.affinity !== null && c.affinity !== undefined);
      return match?.affinity ?? null;
    }
    return null;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [countriesRes, religionsRes, tagsRes] = await Promise.all([
          GeographyService.geographyCountriesList(100),
          IdeologiesService.ideologiesReligionsList(100),
          IdeologiesService.ideologiesTagsList(100),
        ]);
        setCountries(countriesRes.results);
        setReligions(religionsRes.results);
        setTags(tagsRes.results);
      } catch (e) {
        console.error('Error loading filter options', e);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    GeographyService.geographyRegionsList(selectedCountry || undefined, 100)
      .then(res => setRegions(res.results))
      .catch(console.error);

    setSelectedRegion(null);
  }, [selectedCountry]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await IdeologiesService.ideologiesList(
          selectedCountry || undefined,
          100,
          0,
          selectedRegion || undefined,
          selectedReligion || undefined,
          debouncedSearch || undefined,
          selectedTag || undefined,
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
  }, [debouncedSearch, selectedCountry, selectedRegion, selectedReligion, selectedTag]);

  useEffect(() => {
    if (canCalculateAffinity && ideologies.length > 0) {
      let mounted = true;
      const fetchAffinities = async () => {
        setIsCalculating(true);
        setProgress(0);
        let completedAnswerUuid: string | undefined = undefined;
        if (!isAuthenticated || !isVerified) {
          if (tempCompletedAnswerUuid) {
            completedAnswerUuid = tempCompletedAnswerUuid;
          } else {
            try {
              const axisList = Object.entries(answers).map(([uuid, data]) => ({
                uuid,
                value: data.value,
                margin_left: data.margin_left ?? 0,
                margin_right: data.margin_right ?? 0,
              }));
              const conditionersList = Object.entries(conditionerAnswers).map(([uuid, value]) => ({
                uuid,
                value,
              }));
              const snapshot = await AnswersService.answersCompletedGenerateCreate({
                axis: axisList,
                conditioners: conditionersList,
              });
              completedAnswerUuid = snapshot.uuid;
              setTempCompletedAnswerUuid(snapshot.uuid);
            } catch (e) {
              console.error('Failed to generate anonymous snapshot', e);
              if (mounted) setIsCalculating(false);
              return;
            }
          }
        }
        let completed = 0;
        const total = ideologies.length;
        await Promise.all(
          ideologies.map(async ideology => {
            if (!mounted) return;
            try {
              const data = await IdeologiesService.ideologiesAffinityRetrieve(ideology.uuid, completedAnswerUuid);
              if (mounted) {
                const bestScore = calculateBestAffinity(data);
                setAffinities(prev => ({ ...prev, [ideology.uuid]: bestScore }));
              }
            } catch (e) {
              console.error(`Failed to fetch affinity for ${ideology.name}`, e);
              if (mounted) setAffinities(prev => ({ ...prev, [ideology.uuid]: null }));
            } finally {
              if (mounted) {
                completed++;
                setProgress(Math.round((completed / total) * 100));
              }
            }
          }),
        );
        if (mounted) setIsCalculating(false);
      };
      fetchAffinities();
      return () => {
        mounted = false;
      };
    }
  }, [
    canCalculateAffinity,
    ideologies,
    answers,
    conditionerAnswers,
    isAuthenticated,
    isVerified,
    tempCompletedAnswerUuid,
    setTempCompletedAnswerUuid,
  ]);

  const sortedIdeologies = useMemo(() => {
    const items = [...ideologies];
    switch (sortBy) {
      case 'affinity_desc':
        return items.sort((a, b) => {
          const affA = affinities[a.uuid] ?? -1;
          const affB = affinities[b.uuid] ?? -1;
          return affB - affA;
        });
      case 'affinity_asc':
        return items.sort((a, b) => {
          const affA = affinities[a.uuid] ?? 999;
          const affB = affinities[b.uuid] ?? 999;
          return affA - affB;
        });
      case 'name_desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'name_asc':
      default:
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [ideologies, sortBy, affinities]);

  const clearFilters = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedReligion(null);
    setSelectedTag(null);
  };

  const currentSortLabel = t(`sort_${sortBy}`);
  const sortOptions: SortOption[] = canCalculateAffinity
    ? ['name_asc', 'name_desc', 'affinity_desc', 'affinity_asc']
    : ['name_asc', 'name_desc'];

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
          className="relative z-20 w-full max-w-4xl space-y-6"
        >
          <h1 className="text-foreground text-4xl font-black tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg md:text-xl">{t('subtitle')}</p>

          <div className="relative z-50 mx-auto mt-8 flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder={t('search_placeholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  startIcon={<span className="material-symbols-outlined text-[20px]">search</span>}
                  className="bg-secondary/80 border-border focus:bg-secondary border shadow-xl backdrop-blur-md transition-all"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-primary/20 border-primary' : ''}
                >
                  <span className="material-symbols-outlined mr-2">filter_list</span>
                  {tCommon('filters') || 'Filtros'}
                </Button>
                <div className="min-w-[180px]">
                  <Dropdown
                    value={currentSortLabel}
                    options={sortOptions.map(opt => t(`sort_${opt}`))}
                    onChange={val => {
                      const key = sortOptions.find(k => t(`sort_${k}`) === val);
                      if (key) setSortBy(key);
                    }}
                    label={t('sort_label')}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card border-border grid grid-cols-1 gap-4 rounded-2xl border p-6 shadow-2xl md:grid-cols-2 lg:grid-cols-4"
                >
                  <Dropdown
                    label={tCommon('country') || 'País'}
                    value={countries.find(c => c.id === selectedCountry)?.name || tCommon('all') || 'Todos'}
                    options={[tCommon('all') || 'Todos', ...countries.map(c => c.name)]}
                    onChange={val => {
                      const c = countries.find(x => x.name === val);
                      setSelectedCountry(c ? c.id : null);
                    }}
                  />
                  <Dropdown
                    label={tCommon('region') || 'Región'}
                    value={regions.find(r => r.id === selectedRegion)?.name || tCommon('all') || 'Todos'}
                    options={[tCommon('all') || 'Todos', ...regions.map(r => r.name)]}
                    onChange={val => {
                      const r = regions.find(x => x.name === val);
                      setSelectedRegion(r ? r.id : null);
                    }}
                  />
                  <Dropdown
                    label={tCommon('religion') || 'Religión'}
                    value={religions.find(r => r.uuid === selectedReligion)?.name || tCommon('all') || 'Todos'}
                    options={[tCommon('all') || 'Todos', ...religions.map(r => r.name)]}
                    onChange={val => {
                      const r = religions.find(x => x.name === val);
                      setSelectedReligion(r ? r.uuid : null);
                    }}
                  />
                  <Dropdown
                    label={tCommon('tag') || 'Etiqueta'}
                    value={tags.find(tag => tag.uuid === selectedTag)?.name || tCommon('all') || 'Todos'}
                    options={[tCommon('all') || 'Todos', ...tags.map(tag => tag.name)]}
                    onChange={val => {
                      const tag = tags.find(x => x.name === val);
                      setSelectedTag(tag ? tag.uuid : null);
                    }}
                  />
                  <div className="flex justify-end lg:col-span-4">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                      <span className="material-symbols-outlined mr-1 text-sm">restart_alt</span>
                      {tCommon('clear_filters') || 'Limpiar Filtros'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isCalculating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full overflow-hidden"
                >
                  <div className="text-muted-foreground/80 mb-1 flex justify-between px-1 text-[10px] font-bold tracking-wider uppercase">
                    <span>{t('affinity_loading')}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="bg-secondary/50 h-1.5 w-full overflow-hidden rounded-full backdrop-blur-sm">
                    <motion.div
                      className="bg-primary h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'linear', duration: 0.2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                    isLoading={canCalculateAffinity && affinities[ideology.uuid] === undefined}
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
              <Button variant="outline" size="sm" onClick={clearFilters}>
                {tCommon('show_all') || 'Mostrar todo'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
