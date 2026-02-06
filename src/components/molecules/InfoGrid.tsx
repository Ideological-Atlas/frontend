import { cn } from '@/lib/utils';

interface InfoItem {
  icon: string;
  title: string;
  description: string;
}

interface InfoGridProps {
  items: InfoItem[];
  className?: string;
}

export function InfoGrid({ items, className }: InfoGridProps) {
  return (
    <div className={cn('grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            {item.title}
          </div>
          <p className="text-xs opacity-80">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
