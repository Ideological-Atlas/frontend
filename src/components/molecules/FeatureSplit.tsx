import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FeatureSplitProps {
  title: string;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  quote?: string;
  reversed?: boolean;
}

export function FeatureSplit({ title, description, imageSrc, imageAlt, quote, reversed = false }: FeatureSplitProps) {
  return (
    <section className="mb-32 grid gap-12 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={cn(
          'border-border hero-image-transition relative overflow-hidden rounded-2xl border shadow-2xl',
          reversed ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        <div className="relative aspect-video w-full">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
          <div className="from-background/80 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={cn('space-y-6', reversed ? 'lg:order-1' : 'lg:order-2')}
      >
        <h2 className="text-foreground text-3xl font-bold">{title}</h2>
        <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">{description}</div>
        {quote && (
          <blockquote className="border-primary text-foreground border-l-4 pl-4 text-xl font-medium italic">
            &quot;{quote}&quot;
          </blockquote>
        )}
      </motion.div>
    </section>
  );
}
