import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';

export function Header() {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');

  const navKeys = ['home', 'features', 'explore', 'about'];

  return (
    <header className="bg-background border-border sticky top-0 z-50 flex items-center justify-between border-b border-solid px-10 py-4 whitespace-nowrap">
      <div className="text-foreground flex items-center gap-4">
        <div className="relative flex size-8 items-center justify-center">
          <Image src="/logo.png" alt="Ideological Atlas Logo" width={32} height={32} className="object-contain" />
        </div>
        <h2 className="text-lg leading-tight font-bold tracking-[-0.015em]">{tCommon('ideological_atlas')}</h2>
      </div>
      <div className="flex hidden flex-1 justify-end gap-8 lg:flex">
        <div className="flex items-center gap-9">
          {navKeys.map(key => {
            const isActive = key === 'home';
            return (
              <Link
                key={key}
                className={clsx(
                  'text-sm leading-normal transition-colors',
                  isActive ? 'text-primary font-bold' : 'hover:text-primary text-muted-foreground font-medium',
                )}
                href="#"
              >
                {t(key)}
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="primary" className="max-w-[480px]">
            {tCommon('get_started')}
          </Button>
          <Button variant="secondary" className="max-w-[480px]">
            {tCommon('sign_in')}
          </Button>
        </div>
      </div>
      <div className="text-foreground flex items-center lg:hidden">
        <span className="material-symbols-outlined">menu</span>
      </div>
    </header>
  );
}
