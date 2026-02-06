'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Dropdown } from '@/components/atoms/Dropdown';
import type { Country } from '@/lib/client/models/Country';
import type { Region } from '@/lib/client/models/Region';
import type { Religion } from '@/lib/client/models/Religion';
import type { Tag } from '@/lib/client/models/Tag';
import type { SortOption } from '@/hooks/controllers/useEncyclopediaController';

interface EncyclopediaFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  canCalculateAffinity: boolean;
  options: {
    countries: Country[];
    regions: Region[];
    religions: Religion[];
    tags: Tag[];
  };
  filters: {
    country: number | null;
    region: number | null;
    religion: string | null;
    tag: string | null;
  };
  onFilterChange: {
    country: (val: number | null) => void;
    region: (val: number | null) => void;
    religion: (val: string | null) => void;
    tag: (val: string | null) => void;
  };
  onClear: () => void;
  isCalculating: boolean;
  progress: number;
}

export function EncyclopediaFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  canCalculateAffinity,
  options,
  filters,
  onFilterChange,
  onClear,
  isCalculating,
  progress,
}: EncyclopediaFiltersProps) {
  const t = useTranslations('Encyclopedia');
  const tCommon = useTranslations('Common');

  const sortOptions: SortOption[] = canCalculateAffinity
    ? ['name_asc', 'name_desc', 'affinity_desc', 'affinity_asc']
    : ['name_asc', 'name_desc'];

  const currentSortLabel = t(`sort_${sortBy}`);

  return (
    <div className="relative z-50 mx-auto mt-8 flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder={t('search_placeholder')}
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            startIcon={<span className="material-symbols-outlined text-[20px]">search</span>}
            className="bg-secondary/80 border-border focus:bg-secondary border shadow-xl backdrop-blur-md transition-all"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onToggleFilters}
            className={showFilters ? 'bg-primary/20 border-primary' : ''}
          >
            <span className="material-symbols-outlined mr-2">filter_list</span>
            {tCommon('filters')}
          </Button>
          <div className="min-w-[180px]">
            <Dropdown
              value={currentSortLabel}
              options={sortOptions.map(opt => t(`sort_${opt}`))}
              onChange={val => {
                const key = sortOptions.find(k => t(`sort_${k}`) === val);
                if (key) onSortChange(key);
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
              label={tCommon('country')}
              value={options.countries.find(c => c.id === filters.country)?.name || tCommon('all')}
              options={[tCommon('all'), ...options.countries.map(c => c.name)]}
              onChange={val => {
                const c = options.countries.find(x => x.name === val);
                onFilterChange.country(c ? c.id : null);
              }}
            />
            <Dropdown
              label={tCommon('region')}
              value={options.regions.find(r => r.id === filters.region)?.name || tCommon('all')}
              options={[tCommon('all'), ...options.regions.map(r => r.name)]}
              onChange={val => {
                const r = options.regions.find(x => x.name === val);
                onFilterChange.region(r ? r.id : null);
              }}
            />
            <Dropdown
              label={tCommon('religion')}
              value={options.religions.find(r => r.uuid === filters.religion)?.name || tCommon('all')}
              options={[tCommon('all'), ...options.religions.map(r => r.name)]}
              onChange={val => {
                const r = options.religions.find(x => x.name === val);
                onFilterChange.religion(r ? r.uuid : null);
              }}
            />
            <Dropdown
              label={tCommon('tag')}
              value={options.tags.find(tag => tag.uuid === filters.tag)?.name || tCommon('all')}
              options={[tCommon('all'), ...options.tags.map(tag => tag.name)]}
              onChange={val => {
                const tag = options.tags.find(x => x.name === val);
                onFilterChange.tag(tag ? tag.uuid : null);
              }}
            />
            <div className="flex justify-end lg:col-span-4">
              <Button variant="ghost" size="sm" onClick={onClear} className="text-xs">
                <span className="material-symbols-outlined mr-1 text-sm">restart_alt</span>
                {tCommon('clear_filters')}
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
  );
}
