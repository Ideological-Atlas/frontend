'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { AlgorithmCard } from '@/components/molecules/about/AlgorithmCard';

export function AboutView() {
  const t = useTranslations('AboutPage');

  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <MagneticBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl space-y-8"
        >
          <h1 className="text-foreground text-5xl font-black tracking-tighter md:text-7xl">{t('hero.title')}</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">{t('hero.subtitle')}</p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/Ideological-Atlas" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <span className="material-symbols-outlined">code</span>
                {t('hero.github_btn')}
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      <div className="layout-content-container mx-auto w-full max-w-7xl px-6 pb-24">
        <section className="mb-32 grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-border relative overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="relative aspect-video w-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl8rwoOPJmg5qcAJKw4Vc6naau5P9eLyJ11DFXm2z8frKF2DuZpaVtUU0tL_UAYE1-Gg3dtYJgWrWlU_8kCc87rTxzi3e-c6ywBJA1hpaaPmgc3hKuIOpw3Qfv3euB3XL9at_gn3qn5xy3pyMMkJDpTLV2gMQc4T4FV5HMpZdZWzkQW17SYW4cfF3k9iyZ3LbX4Tdlh4RTI92ZQxhbAMjigy44BQhG-ULKSVmLIkOkxN7NYTEX_vir3J4LmvlsDq5UrY5E_VTLT60"
                alt="Ideological Atlas Viz"
                fill
                className="object-cover"
              />
              <div className="from-background/80 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-foreground text-3xl font-bold">{t('story.title')}</h2>
            <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
              <p>{t('story.content_p1')}</p>
              <p>{t('story.content_p2')}</p>
            </div>
            <blockquote className="border-primary text-foreground border-l-4 pl-4 text-xl font-medium italic">
              &quot;{t('story.quote')}&quot;
            </blockquote>
          </motion.div>
        </section>

        <section className="mb-32">
          <div className="mb-16 text-center">
            <h2 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">{t('algorithm.title')}</h2>
            <p className="text-muted-foreground mt-4 text-lg">{t('algorithm.subtitle')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AlgorithmCard
              title={t('algorithm.indifference_title')}
              description={t('algorithm.indifference_desc')}
              icon="sentiment_neutral"
              delay={0.1}
            />
            <AlgorithmCard
              title={t('algorithm.quadratic_title')}
              description={t('algorithm.quadratic_desc')}
              icon="function"
              delay={0.2}
              formula={<span>A = 50 * (1 - g/200)²</span>}
            />
            <AlgorithmCard
              title={t('algorithm.phases_title')}
              description={t('algorithm.phases_gap')}
              icon="join_inner"
              delay={0.3}
              formula={<span>Gap vs Overlap Logic</span>}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/20 border-border mt-6 rounded-2xl border p-8 text-center"
          >
            <h3 className="text-foreground mb-2 text-lg font-bold">{t('algorithm.aggregation_title')}</h3>
            <p className="text-muted-foreground">{t('algorithm.aggregation_desc')}</p>
            <div className="text-primary mt-4 flex justify-center gap-2 font-mono text-sm">
              <span>Axis</span>
              <span className="text-muted-foreground">→</span>
              <span>Section</span>
              <span className="text-muted-foreground">→</span>
              <span>Complexity</span>
              <span className="text-muted-foreground">→</span>
              <span>Global</span>
            </div>
          </motion.div>
        </section>

        <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-black">{t('contribute.title')}</h2>
            <p className="mb-10 text-xl opacity-90">{t('contribute.subtitle')}</p>

            <div className="mb-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                  {t('contribute.role_dev')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_dev_desc')}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  {t('contribute.role_research')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_research_desc')}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">palette</span>
                  {t('contribute.role_design')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_design_desc')}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  {t('contribute.role_product')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_product_desc')}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                  {t('contribute.role_data')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_data_desc')}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">translate</span>
                  {t('contribute.role_translate')}
                </div>
                <p className="text-xs opacity-80">{t('contribute.role_translate_desc')}</p>
              </div>
            </div>

            <a href="https://github.com/Ideological-Atlas" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="font-bold shadow-lg">
                <span className="material-symbols-outlined mr-2">group_add</span>
                GitHub Repository
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
