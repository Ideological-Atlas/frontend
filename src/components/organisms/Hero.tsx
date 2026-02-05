'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/SmartLink';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { TiltImageCard } from '@/components/molecules/TiltImageCard';
import { useSmartRouter } from '@/hooks/useSmartRouter';
import { env } from '@/env';

export function Hero() {
  const t = useTranslations('Hero');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useSmartRouter();

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden px-5 py-5 md:px-20 xl:px-40">
      <div className="hidden md:block">
        <MagneticBackground />
      </div>

      <div className="layout-content-container relative z-10 flex max-w-[1200px] flex-1 flex-col">
        <div className="@container">
          <div className="flex flex-col items-center gap-10 px-4 py-10 text-center lg:flex-row lg:gap-16 lg:text-left">
            <div className="flex flex-col items-center justify-center gap-6 lg:w-1/2 lg:items-start">
              <SectionHeader
                title={t('title')}
                subtitle={t('subtitle')}
                align="left"
                className="items-center text-center lg:items-start lg:text-left"
                titleClassName="text-4xl md:text-5xl lg:text-6xl"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <Link href={`/${locale}/atlas`}>
                  <Button variant="primary" className="shadow-primary/20 h-12 px-6 text-base shadow-lg">
                    {tCommon('start_now')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-12 px-6 text-base"
                  onClick={() => router.push(`/${locale}/encyclopedia`)}
                >
                  {tCommon('explore_ideologies')}
                </Button>
              </motion.div>
            </div>

            <TiltImageCard href={`/${locale}/about`} imageSrc={env.NEXT_PUBLIC_HERO_IMAGE_URL} />
          </div>
        </div>
      </div>
    </div>
  );
}
