import { cn } from '@/lib/utils';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text, className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-10', className)}>
      <div className="bg-primary/10 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
        <span className="material-symbols-outlined text-primary animate-spin text-[32px]">sync</span>
      </div>
      {text && <p className="text-muted-foreground mt-6 text-sm font-medium">{text}</p>}
    </div>
  );
}
