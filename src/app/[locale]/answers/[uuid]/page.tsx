import { PublicAtlasView } from '@/components/organisms/Atlas/PublicAtlasView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil Ideológico | Ideological Atlas',
  description: 'Ver perfil ideológico detallado.',
};

export default async function PublicAnswerPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return (
    <div className="bg-background min-h-screen">
      <PublicAtlasView uuid={uuid} />
    </div>
  );
}
