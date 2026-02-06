'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';
import { ComplexitySelector } from './ComplexitySelector';
import { IdeologyProfileCard } from '@/components/molecules/IdeologyProfileCard';
import { useIdeologyAtlasController } from '@/hooks/controllers/useIdeologyAtlasController';
import { useAuthStore } from '@/store/useAuthStore';

type ControllerData = ReturnType<typeof useIdeologyAtlasController>;
type AuthUser = ReturnType<typeof useAuthStore.getState>['user'];

interface IdeologyAtlasSidebarProps {
  state: ControllerData['state'];
  actions: ControllerData['actions'];
  user: AuthUser;
  onOpenDrawer: () => void;
}

export function IdeologyAtlasSidebar({ state, actions, user, onOpenDrawer }: IdeologyAtlasSidebarProps) {
  const t = useTranslations('Atlas');
  const tEnc = useTranslations('Encyclopedia');

  const ideologyName = state.ideologyData?.name || 'Ideology';
  const ideologyColor = state.ideologyData?.color || 'var(--muted-foreground)';
  const viewVariant = state.isSuperUser ? 'default' : 'other';

  const locationText = state.ideologyData?.associated_countries.length
    ? state.ideologyData.associated_countries.map(c => c.name).join(', ')
    : 'Universal';

  const religionText = state.ideologyData?.associated_religions.length
    ? state.ideologyData.associated_religions.map(r => r.name).join(', ')
    : tEnc('secular');

  return (
    <div className="flex w-full flex-col gap-6">
      {state.isSuperUser && (
        <div className="w-full">
          <div className="border-warning/50 bg-warning/10 text-warning flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-black tracking-widest uppercase select-none">
            <span className="material-symbols-outlined text-sm">edit_document</span>
            {t('admin_mode_label')}
          </div>
        </div>
      )}

      <IdeologyProfileCard
        name={ideologyName}
        color={ideologyColor}
        flag={state.ideologyData?.flag}
        tags={state.ideologyData?.tags || []}
        location={locationText}
        religion={religionText}
        onReadArticle={onOpenDrawer}
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-foreground px-1 text-sm font-bold tracking-widest uppercase opacity-70">
          {t('complexity_level')}
        </h2>
        <ComplexitySelector
          complexities={state.complexities}
          selectedId={state.selectedComplexity}
          onSelect={actions.selectComplexity}
          isLoading={false}
          progressMap={state.progressMap}
          myProgressMap={viewVariant === 'other' ? state.myProgressMap : undefined}
          targetUsername={ideologyName}
          viewerUsername={user?.username}
          affinityMap={viewVariant === 'other' ? state.complexityAffinityMap : undefined}
          variant={viewVariant}
          customHexColor={ideologyColor}
        />
      </div>

      <div className="border-border/50 border-t pt-6">
        <Link href="/encyclopedia" className="block w-full">
          <Button
            variant="ghost"
            size="default"
            className="text-muted-foreground hover:text-foreground w-full justify-start gap-3 pl-0 hover:bg-transparent"
          >
            <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </div>
            {t('back_to_encyclopedia')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
