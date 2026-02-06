'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';

interface ExploreIdeologyButtonProps {
  uuid: string;
}

export function ExploreIdeologyButton({ uuid }: ExploreIdeologyButtonProps) {
  const t = useTranslations('Encyclopedia');

  return (
    <Link href={`/encyclopedia/${uuid}/definitions`}>
      <Button
        variant="primary"
        className="border-none bg-green-600 px-6 text-white shadow-lg shadow-green-900/20 hover:bg-green-500"
      >
        {t('explore_in_atlas')}
        <span className="material-symbols-outlined ml-2 text-lg">explore</span>
      </Button>
    </Link>
  );
}
