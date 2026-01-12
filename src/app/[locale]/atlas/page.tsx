import { AtlasView } from '@/components/organisms/Atlas/AtlasView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas Ideológico | Ideological Atlas',
  description: 'Define tu posición en el espectro.',
};

export default function AtlasPage() {
  return (
    <div className="bg-background min-h-screen">
      <AtlasView />
    </div>
  );
}
