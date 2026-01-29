import { useState, useMemo } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import { TypeEnum } from '@/lib/client/models/TypeEnum';
import type { IdeologySection } from '@/lib/client/models/IdeologySection';

interface UseAtlasNavigationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkVisibility: (rules: any) => boolean;
  contextSectionLabel: string;
}

export function useAtlasNavigation({ checkVisibility, contextSectionLabel }: UseAtlasNavigationProps) {
  const { complexities, sections, conditioners, axes } = useAtlasStore();

  const [internalComplexity, setInternalComplexity] = useState<string | null>(null);
  const [internalSection, setInternalSection] = useState<string | null>(null);

  const defaultComplexity = useMemo(() => {
    if (complexities.length > 0) {
      return [...complexities].sort((a, b) => a.complexity - b.complexity)[0].uuid;
    }
    return null;
  }, [complexities]);

  const selectedComplexity = internalComplexity ?? defaultComplexity;

  const displaySections: IdeologySection[] = useMemo(() => {
    const rawSections = selectedComplexity ? sections[selectedComplexity] || [] : [];
    const rawConditioners = selectedComplexity ? conditioners[selectedComplexity] || [] : [];

    const filteredSections = rawSections.filter(section => checkVisibility(section.condition_rules));

    const visibleConditioners = rawConditioners.filter(
      cond => cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules),
    );

    if (visibleConditioners.length > 0) {
      const contextSection: IdeologySection = {
        uuid: `context_${selectedComplexity}`,
        name: contextSectionLabel,
        description: null,
        icon: 'info',
        condition_rules: [],
      };
      return [contextSection, ...filteredSections];
    }

    return filteredSections;
  }, [selectedComplexity, sections, conditioners, checkVisibility, contextSectionLabel]);

  const selectedSection = useMemo(() => {
    if (internalSection && displaySections.some(s => s.uuid === internalSection)) {
      return internalSection;
    }
    return displaySections.length > 0 ? displaySections[0].uuid : null;
  }, [internalSection, displaySections]);

  const isContextSelected = !!selectedSection && selectedSection.startsWith('context_');

  const currentConditioners = useMemo(() => {
    const raw = selectedComplexity ? conditioners[selectedComplexity] || [] : [];
    return raw.filter(cond => cond.type !== TypeEnum.AXIS_RANGE && checkVisibility(cond.condition_rules));
  }, [selectedComplexity, conditioners, checkVisibility]);

  const currentAxes = useMemo(() => {
    if (!selectedSection || isContextSelected) return [];
    const rawAxes = axes[selectedSection] || [];
    return rawAxes.filter(axis => checkVisibility(axis.condition_rules));
  }, [selectedSection, axes, checkVisibility, isContextSelected]);

  return {
    selectedComplexity,
    setSelectedComplexity: setInternalComplexity,
    selectedSection,
    setSelectedSection: setInternalSection,
    displaySections,
    currentConditioners,
    currentAxes,
    isContextSelected,
  };
}
