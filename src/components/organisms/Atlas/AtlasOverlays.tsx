'use client';

import { ShareModal } from '@/components/molecules/ShareModal';
import { UnverifiedWarningModal } from './UnverifiedWarningModal';
import { AtlasOnboarding } from './AtlasOnboarding';
import { IncompleteLevelModal } from '@/components/molecules/IncompleteLevelModal';
import { useAtlasController } from '@/hooks/controllers/useAtlasController';

type ControllerData = ReturnType<typeof useAtlasController>;

interface AtlasOverlaysProps {
  state: ControllerData['state'];
  actions: ControllerData['actions'];
}

export function AtlasOverlays({ state, actions }: AtlasOverlaysProps) {
  return (
    <>
      <UnverifiedWarningModal />
      <AtlasOnboarding />

      <ShareModal isOpen={state.isShareModalOpen} onClose={actions.closeShareModal} shareUrl={state.shareUrl} />

      <IncompleteLevelModal
        isOpen={state.isIncompleteModalOpen}
        onClose={actions.closeIncompleteModal}
        onContinue={actions.confirmNextLevel}
        onSelectSection={actions.jumpToSection}
        incompleteSections={state.incompleteSections}
      />
    </>
  );
}
