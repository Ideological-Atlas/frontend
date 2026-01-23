'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { clsx } from 'clsx';

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
}

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function LegalSidebar({ items }: { items: SidebarItem[] }) {
  const t = useTranslations('Legal');
  const [activeId, setActiveId] = useState<string>('');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0,
      },
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="hidden lg:col-span-3 lg:block"
    >
      <div className="sticky top-24 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="border-border flex flex-col border-b pb-2">
            <h1 className="text-foreground text-sm font-bold tracking-wider uppercase">{t('table_of_contents')}</h1>
          </div>
          <nav aria-label="Navigation" className="flex flex-col gap-1">
            {items.map(item => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={clsx(
                    'group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-left transition-all',
                    isActive
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-secondary hover:border-primary/50 border-transparent',
                  )}
                >
                  <span
                    className={clsx(
                      'material-symbols-outlined text-[20px] transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={clsx(
                      'text-sm font-medium transition-colors',
                      isActive ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-card border-border rounded-xl border p-5 shadow-sm">
          <h3 className="text-foreground mb-2 text-sm font-bold">{t('need_help_title')}</h3>
          <p className="text-muted-foreground mb-4 text-xs leading-relaxed">{t('need_help_desc')}</p>
          <a href="mailto:support@ideologicalatlas.com" className="w-full">
            <Button variant="secondary" className="w-full text-xs">
              {t('open_ticket')}
            </Button>
          </a>
        </div>
      </div>
    </motion.aside>
  );
}
