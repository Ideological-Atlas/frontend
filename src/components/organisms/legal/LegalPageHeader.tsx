'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, type Variants } from 'framer-motion';
import { Link } from '@/components/atoms/SmartLink';

interface LegalPageHeaderProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  version?: string;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function LegalPageHeader({ title, subtitle, lastUpdated, version }: LegalPageHeaderProps) {
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="border-border mb-10 flex flex-col gap-6 border-b pb-8"
    >
      <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {tCommon('home')}
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <div className="flex flex-col gap-4">
        <h1 className="text-foreground text-4xl leading-tight font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
        {(lastUpdated || version) && (
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
            {lastUpdated && (
              <>
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>{lastUpdated}</span>
              </>
            )}
            {lastUpdated && version && <span className="mx-2 opacity-50">•</span>}
            {version && <span>{version}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
