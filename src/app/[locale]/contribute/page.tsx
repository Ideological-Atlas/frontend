'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ContributePage() {
  const t = useTranslations('ContributePage');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center gap-12"
      >
        <motion.div variants={item} className="max-w-2xl space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text pb-2 text-4xl font-black tracking-tight text-transparent md:text-6xl">
            {t('hero_title')}
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">{t('hero_subtitle')}</p>
        </motion.div>

        <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left Column: Info */}
          <motion.div variants={item} className="space-y-8">
            <div className="bg-card border-border rounded-2xl border p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">{t('why_contribute_title')}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t('why_contribute_desc')}</p>
            </div>

            <div className="bg-card border-border rounded-2xl border p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold">{t('cost_breakdown')}</h3>
              <div className="space-y-4">
                <div className="bg-secondary/50 flex items-center gap-4 rounded-lg p-3">
                  <span className="material-symbols-outlined text-primary text-2xl">dns</span>
                  <span className="font-medium">{t('servers')}</span>
                </div>
                <div className="bg-secondary/50 flex items-center gap-4 rounded-lg p-3">
                  <span className="material-symbols-outlined text-primary text-2xl">code</span>
                  <span className="font-medium">{t('development')}</span>
                </div>
                <div className="bg-secondary/50 flex items-center gap-4 rounded-lg p-3">
                  <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                  <span className="font-medium">{t('coffee')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Donation */}
          <motion.div variants={item} className="group relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--primary)] to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-50"></div>
            <div className="bg-card border-border relative flex flex-col items-center space-y-8 rounded-2xl border p-8 text-center shadow-xl">
              <div className="flex w-full flex-col items-center space-y-4">
                <h3 className="text-2xl font-bold">{t('one_time_donation')}</h3>
                <a
                  href="https://www.buymeacoffee.com/martingaldk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=martingaldk&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                    alt="Buy me a book"
                    className="h-14"
                  />
                </a>
              </div>

              <div className="relative w-full py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="border-border w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card text-muted-foreground px-2 font-medium tracking-widest">Or</span>
                </div>
              </div>

              <div className="flex w-full flex-col items-center space-y-4">
                <h3 className="text-muted-foreground text-lg font-medium">{t('scan_qr')}</h3>
                <div className="inline-block rounded-xl bg-white p-4 shadow-inner">
                  <Image src="/qr-code.png" alt="Donate QR Code" width={200} height={200} className="rounded-lg" />
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-primary text-sm font-medium">{t('thank_you')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
