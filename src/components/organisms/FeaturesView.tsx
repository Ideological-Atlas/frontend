import { FeaturesHero } from '@/components/organisms/features/FeaturesHero';
import { CurrentFeaturesGrid } from '@/components/organisms/features/CurrentFeaturesGrid';
import { RoadmapSection } from '@/components/organisms/features/RoadmapSection';

export function FeaturesView() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <FeaturesHero />

      <div className="bg-muted/40 border-border w-full border-t py-24">
        <div className="layout-content-container mx-auto w-full max-w-7xl px-6">
          <CurrentFeaturesGrid />
          <RoadmapSection />
        </div>
      </div>
    </div>
  );
}
