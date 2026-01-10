import { useTranslations } from "next-intl";
import { FeatureCard } from "../molecules/FeatureCard";

export function Features() {
  const t = useTranslations("Features");

  return (
    <div className="px-5 md:px-20 xl:px-40 flex flex-1 justify-center py-5 bg-slate-50 dark:bg-surface-dark/30">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="flex flex-col gap-10 px-4 py-16 @container">
          <div className="flex flex-col gap-4 text-center items-center">
            <h1 className="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight md:text-4xl max-w-[720px]">
              {t("title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-[720px]">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="linear_scale"
              title={t("cards.spectrum.title")}
              description={t("cards.spectrum.description")}
            />
            <FeatureCard
              icon="explore"
              title={t("cards.exploration.title")}
              description={t("cards.exploration.description")}
            />
            <FeatureCard
              icon="query_stats"
              title={t("cards.analysis.title")}
              description={t("cards.analysis.description")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
