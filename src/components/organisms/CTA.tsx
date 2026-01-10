import { useTranslations } from "next-intl";
import { Button } from "../atoms/Button";

export function CTA() {
  const t = useTranslations("CTA");
  const tCommon = useTranslations("Common");

  return (
    <div className="px-5 md:px-20 xl:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="@container">
          <div className="flex flex-col items-center justify-center gap-8 px-4 py-20 bg-gradient-to-b from-transparent to-primary/5 rounded-3xl mt-10 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-black leading-tight md:text-5xl max-w-[720px]">
                {t("title")}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg font-normal leading-relaxed max-w-[600px] mx-auto">
                {t("text")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button variant="primary" className="h-12 px-6 text-base min-w-[200px] shadow-lg shadow-blue-500/20">
                {tCommon("create_profile")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
