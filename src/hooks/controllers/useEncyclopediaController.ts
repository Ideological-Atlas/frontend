import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import { IdeologiesService } from '@/lib/client/services/IdeologiesService';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { GeographyService } from '@/lib/client/services/GeographyService';
import type { IdeologyList } from '@/lib/client/models/IdeologyList';
import type { IdeologyAffinity } from '@/lib/client/models/IdeologyAffinity';
import type { Country } from '@/lib/client/models/Country';
import type { Region } from '@/lib/client/models/Region';
import type { Religion } from '@/lib/client/models/Religion';
import type { Tag } from '@/lib/client/models/Tag';

export type SortOption = 'name_asc' | 'name_desc' | 'affinity_desc' | 'affinity_asc';

export function useEncyclopediaController() {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const { answers, conditionerAnswers, tempCompletedAnswerUuid, setTempCompletedAnswerUuid } = useAtlasStore();
  const isVerified = user?.is_verified ?? false;

  const [ideologies, setIdeologies] = useState<IdeologyList[]>([]);
  const [affinities, setAffinities] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIdeology, setSelectedIdeology] = useState<IdeologyList | null>(null);

  const hasLocalAnswers = useMemo(() => {
    return Object.keys(answers).length > 0 || Object.keys(conditionerAnswers).length > 0;
  }, [answers, conditionerAnswers]);

  const canCalculateAffinity = (isAuthenticated && isVerified) || hasLocalAnswers;

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
        console.error(e);
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
        console.error(error);
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

  const calculateBestAffinity = useCallback((data: IdeologyAffinity): number | null => {
    if (data.complexities && data.complexities.length > 0) {
      const sorted = [...data.complexities].sort(
        (a, b) => (b.complexity?.complexity ?? 0) - (a.complexity?.complexity ?? 0),
      );
      const match = sorted.find(c => c.affinity !== null && c.affinity !== undefined);
      if (match && match.affinity !== null && match.affinity !== undefined) {
        return match.affinity;
      }
    }
    return data.total_affinity ?? null;
  }, []);

  useEffect(() => {
    if (!canCalculateAffinity || ideologies.length === 0) return;

    if (isAuthenticated && !accessToken) return;

    let mounted = true;

    const fetchAffinities = async () => {
      setIsCalculating(true);
      setProgress(0);
      let completedAnswerUuid: string | undefined = undefined;

      if (!isAuthenticated) {
        if (tempCompletedAnswerUuid) {
          completedAnswerUuid = tempCompletedAnswerUuid;
        } else if (hasLocalAnswers) {
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
            console.error(e);
            if (mounted) setIsCalculating(false);
            return;
          }
        } else {
          if (mounted) setIsCalculating(false);
          return;
        }
      }

      let completed = 0;
      const total = ideologies.length;

      await Promise.allSettled(
        ideologies.map(async ideology => {
          if (!mounted) return;
          try {
            const data = await IdeologiesService.ideologiesAffinityRetrieve(ideology.uuid, completedAnswerUuid);
            if (mounted) {
              const bestScore = calculateBestAffinity(data);
              setAffinities(prev => ({ ...prev, [ideology.uuid]: bestScore }));
            }
          } catch (e) {
            console.warn(`Error fetching affinity for ${ideology.name}`, e);
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
  }, [
    canCalculateAffinity,
    ideologies,
    answers,
    conditionerAnswers,
    isAuthenticated,
    isVerified,
    accessToken,
    tempCompletedAnswerUuid,
    setTempCompletedAnswerUuid,
    calculateBestAffinity,
    hasLocalAnswers,
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

  const handlers = {
    setSearch,
    setSortBy,
    setShowFilters,
    setSelectedCountry,
    setSelectedRegion,
    setSelectedReligion,
    setSelectedTag,
    clearFilters,
    setSelectedIdeology,
  };

  return {
    state: {
      ideologies: sortedIdeologies,
      isLoading,
      isCalculating,
      progress,
      affinities,
      search,
      sortBy,
      showFilters,
      canCalculateAffinity,
      selectedIdeology,
      options: {
        countries,
        regions,
        religions,
        tags,
      },
      filters: {
        country: selectedCountry,
        region: selectedRegion,
        religion: selectedReligion,
        tag: selectedTag,
      },
    },
    actions: handlers,
  };
}
