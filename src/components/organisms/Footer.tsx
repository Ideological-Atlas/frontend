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
    <footer className="bg-background-light dark:bg-background-dark mt-auto flex flex-col gap-6 border-t border-slate-200 px-5 py-10 text-center dark:border-slate-800">
      <div className="layout-content-container mx-auto flex w-full max-w-[960px] flex-col">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 md:justify-center">
          {links.map(link => (
            <Link
              key={link.key}
              className="hover:text-primary min-w-[100px] text-sm leading-normal font-normal text-slate-500 transition-colors dark:text-slate-400"
              href={link.href}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
        <p className="text-sm leading-normal font-normal text-slate-500 dark:text-slate-500">
          © {year} {tCommon('ideological_atlas')}. {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
