'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';
import { motion } from 'framer-motion';

export function Hero() {
  const t = useTranslations('Hero');
  const tCommon = useTranslations('Common');

  return (
    <div className="flex flex-1 justify-center px-5 py-5 md:px-20 xl:px-40">
      <div className="layout-content-container flex max-w-[1200px] flex-1 flex-col">
        <div className="@container">
          <div className="flex flex-col items-center gap-10 px-4 py-10 lg:flex-row lg:gap-16">
            <div className="flex flex-col justify-center gap-6 lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4 text-left"
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
                className="flex flex-wrap gap-3"
              >
                <Button variant="primary" className="h-12 px-6 text-base shadow-lg shadow-blue-900/20">
                  {tCommon('start_now')}
                </Button>
                <Button variant="outline">{tCommon('learn_more')}</Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                type: 'spring',
                bounce: 0.4,
              }}
              className="bg-card group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl lg:w-1/2"
            >
              <div className="from-primary/20 pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr to-purple-500/20 mix-blend-overlay"></div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgW3xqONpPVk-2qt7_VhjJGmhhMlqhzUq2XJW6GrjMaTJmb6NTWB5FvUAOURaixKtIyhK8-euTfDOPDR9fFCIK0NEwpw7uEhlqKZeCUB70ppRUsJFSSKqL_yDRjYkJyg-RD1DYNIVwQMZLMS9pHH-JIlSzeBoFZcrMsyYhGNTPsfnNuwJDj_St5Ly04TOoqQYV8qV0K_JnaCuEIR0lpCrqM8P9pY2hjuHlQIh7AcID-iLsJlfagvBU6jBV1t_jJDB0Fp9sERk7Jcw")',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
