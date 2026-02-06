import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col items-center text-center', className)}>
      <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
      </div>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
    </div>
  );
}
