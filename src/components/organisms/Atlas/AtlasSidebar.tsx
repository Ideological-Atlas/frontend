'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { ComplexitySelector } from './ComplexitySelector';
import { ProgressCard } from '@/components/molecules/ProgressCard';
import { useAtlasController } from '@/hooks/controllers/useAtlasController';

type ControllerData = ReturnType<typeof useAtlasController>;

interface AtlasSidebarProps {
  state: ControllerData['state'];
  actions: ControllerData['actions'];
  loading: ControllerData['loading'];
  onDiscoveryClick: () => void;
  onRestartTutorial: () => void;
}

export function AtlasSidebar({ state, actions, loading, onDiscoveryClick, onRestartTutorial }: AtlasSidebarProps) {
  const t = useTranslations('Atlas');
  const tOnboarding = useTranslations('Onboarding');

  return (
    <>
      <div className="mb-6 flex flex-col gap-1 px-1">
        <h2 className="text-foreground text-lg font-bold tracking-tight">{t('complexity_level')}</h2>
        <p className="text-muted-foreground text-xs">{t('complexity_subtitle')}</p>
      </div>

      <div id="atlas-complexity-list">
        <ComplexitySelector
          complexities={state.complexities}
          selectedId={state.selectedComplexity}
          onSelect={actions.selectComplexity}
          isLoading={false}
          progressMap={state.progressMap}
          isProgressLoading={loading.isStructureLoading}
        />
      </div>

      {state.selectedComplexity && (
        <div id="atlas-progress-card">
          <ProgressCard
            label={t('progress_label', { name: state.selectedComplexityObj?.name || '' })}
            percentage={state.selectedProgress}
            className="mt-6"
            onShare={actions.share}
            isSharing={loading.isGeneratingShare}
            isLoading={loading.isStructureLoading}
          />

          <div className="mt-4" id="atlas-discovery-btn">
            <Button
              onClick={onDiscoveryClick}
              variant="primary"
              disabled={loading.isStructureLoading || state.selectedProgress < 100}
              className="shadow-primary/20 w-full shadow-lg"
            >
              <span className="material-symbols-outlined mr-2">explore</span>
              {t('discover_ideology_btn')}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRestartTutorial}
          className="text-muted-foreground hover:text-primary text-xs"
        >
          <span className="material-symbols-outlined mr-2 text-[16px]">help</span>
          {tOnboarding('restart_tutorial')}
        </Button>
      </div>
    </>
  );
}
