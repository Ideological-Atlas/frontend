import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';

export function CTA() {
  const t = useTranslations('CTA');
  const tCommon = useTranslations('Common');

  return (
    <div className="flex flex-1 justify-center px-5 py-5 md:px-20 xl:px-40">
      <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
        <div className="@container">
          <div className="to-primary/5 mt-10 flex flex-col items-center justify-center gap-8 rounded-3xl border border-slate-200 bg-gradient-to-b from-transparent px-4 py-20 dark:border-slate-800">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="max-w-[720px] text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-[600px] text-lg leading-relaxed font-normal text-slate-600 dark:text-slate-300">
                {t('text')}
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button variant="primary" className="h-12 min-w-[200px] px-6 text-base shadow-lg shadow-blue-500/20">
                {tCommon('create_profile')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
