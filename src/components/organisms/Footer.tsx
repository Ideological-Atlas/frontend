import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  const links = [
    { key: "privacy", href: "#" },
    { key: "terms", href: "#" },
    { key: "contact", href: "#" }
  ];

  return (
    <footer className="flex flex-col gap-6 px-5 py-10 text-center border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark mt-auto">
      <div className="layout-content-container flex flex-col max-w-[960px] mx-auto w-full">
        <div className="flex flex-wrap items-center justify-center gap-6 md:justify-center mb-8">
          {links.map((link) => (
            <Link
              key={link.key}
              className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-normal leading-normal min-w-[100px]"
              href={link.href}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
        <p className="text-slate-500 dark:text-slate-500 text-sm font-normal leading-normal">
          © {year} {tCommon("ideological_atlas")}. {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
