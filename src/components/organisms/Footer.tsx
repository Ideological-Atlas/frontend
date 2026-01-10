import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('Footer');
  const tCommon = useTranslations('Common');
  const year = new Date().getFullYear();

  const links = [
    { key: 'privacy', href: '#' },
    { key: 'terms', href: '#' },
    { key: 'contact', href: '#' },
  ];

  return (
    <footer className="bg-background border-border mt-auto flex flex-col gap-6 border-t px-5 py-10 text-center">
      <div className="layout-content-container mx-auto flex w-full max-w-[960px] flex-col">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 md:justify-center">
          {links.map(link => (
            <Link
              key={link.key}
              className="hover:text-primary text-muted-foreground min-w-[100px] text-sm leading-normal font-normal transition-colors"
              href={link.href}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
        <p className="text-muted-foreground text-sm leading-normal font-normal">
          © {year} {tCommon('ideological_atlas')}. {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
