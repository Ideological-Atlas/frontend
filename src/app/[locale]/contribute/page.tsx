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
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center gap-12"
      >
        <motion.div variants={item} className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-purple-600 pb-2">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl items-start">
          {/* Left Column: Info */}
          <motion.div variants={item} className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{t('why_contribute_title')}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('why_contribute_desc')}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">{t('cost_breakdown')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="material-symbols-outlined text-primary text-2xl">dns</span>
                  <span className="font-medium">{t('servers')}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="material-symbols-outlined text-primary text-2xl">code</span>
                  <span className="font-medium">{t('development')}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="material-symbols-outlined text-primary text-2xl">coffee</span>
                  <span className="font-medium">{t('coffee')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Donation */}
          <motion.div variants={item} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-8">
              
              <div className="space-y-4 w-full flex flex-col items-center">
                <h3 className="text-2xl font-bold">{t('one_time_donation')}</h3>
                <a 
                  href="https://www.buymeacoffee.com/martingaldk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img 
                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=martingaldk&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" 
                    alt="Buy me a coffee" 
                    className="h-14"
                  />
                </a>
              </div>

              <div className="relative w-full py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium tracking-widest">Or</span>
                </div>
              </div>

              <div className="space-y-4 w-full flex flex-col items-center">
                <h3 className="text-lg font-medium text-muted-foreground">{t('scan_qr')}</h3>
                <div className="p-4 bg-white rounded-xl shadow-inner inline-block">
                  <Image 
                    src="/qr-code.png" 
                    alt="Donate QR Code" 
                    width={200} 
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 text-center">
                 <p className="text-sm font-medium text-primary">
                   {t('thank_you')}
                 </p>
              </div>

            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
