import { WavyBackground } from '@/components/atoms/WavyBackground';

interface PageHeaderProps {
  title: string;
  description: string;
  variant?: 'default' | 'other';
}

export function PageHeader({ title, description, variant = 'default' }: PageHeaderProps) {
  return (
    <section className="border-border bg-card relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-8 text-center shadow-sm">
      <WavyBackground variant={variant} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        <p className="text-muted-foreground max-w-[600px] text-base">{description}</p>
      </div>
    </section>
  );
}
