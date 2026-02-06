import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    href: string;
    icon?: string;
  };
  className?: string;
}

export function HeroSection({ title, subtitle, primaryAction, className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center',
        className,
      )}
    >
      <MagneticBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl space-y-8"
      >
        <h1 className="text-foreground text-5xl font-black tracking-tighter md:text-7xl">{title}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">{subtitle}</p>
        <div className="flex justify-center gap-4">
          {primaryAction && (
            <a href={primaryAction.href} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                {primaryAction.icon && <span className="material-symbols-outlined">{primaryAction.icon}</span>}
                {primaryAction.label}
              </Button>
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
