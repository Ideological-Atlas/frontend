import { cn } from '@/lib/utils';

interface StatusMessageProps {
  icon: string;
  title: string;
  description?: string;
  iconClassName?: string;
  className?: string;
}

export function StatusMessage({ icon, title, description, iconClassName, className }: StatusMessageProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <span className={cn('material-symbols-outlined text-primary text-[40px]', iconClassName)}>{icon}</span>
      </div>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">{description}</p>}
    </div>
  );
}
