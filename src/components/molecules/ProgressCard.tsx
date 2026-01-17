import { clsx } from 'clsx';

interface ProgressCardProps {
  label: string;
  percentage: number;
  className?: string;
}

export function ProgressCard({ label, percentage, className }: ProgressCardProps) {
  return (
    <div className={clsx('bg-card border-border flex flex-col gap-3 rounded-2xl border p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <span className="text-primary text-lg font-black">{percentage}%</span>
      </div>
      <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
