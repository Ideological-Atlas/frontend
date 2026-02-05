'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: 'center' | 'left';
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({ title, subtitle, align = 'center', className, titleClassName }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <h1
        className={clsx(
          'text-foreground text-3xl leading-tight font-black tracking-tight md:text-4xl lg:text-5xl',
          titleClassName,
        )}
      >
        {title}
      </h1>
      <p className="text-muted-foreground max-w-[600px] text-lg leading-relaxed font-normal">{subtitle}</p>
    </motion.div>
  );
}
