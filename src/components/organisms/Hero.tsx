'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '../atoms/Button';
import { motion } from 'framer-motion';
import { MagneticBackground } from '../molecules/MagneticBackground';
import { Link } from '@/components/atoms/SmartLink';
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-foreground text-4xl leading-tight font-black tracking-[-0.033em] md:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>
                <h2 className="text-muted-foreground text-lg leading-relaxed font-normal">{t('subtitle')}</h2>
              </motion.div>
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
                  onClick={() => router.push(`/${locale}/about`)}
                >
                  {tCommon('learn_more')}
                </Button>
              </motion.div>
            </div>

            <Link
              href={`/${locale}/about`}
              className="group relative hidden aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl lg:block lg:w-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="h-full w-full bg-cover bg-center"
              >
                <div className="from-primary/20 to-accent/20 pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr mix-blend-overlay"></div>
                <div
                  className="hero-image-transition h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${env.NEXT_PUBLIC_HERO_IMAGE_URL}")`,
                  }}
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
