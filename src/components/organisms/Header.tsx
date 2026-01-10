import { useTranslations } from "next-intl";
import { Button } from "../atoms/Button";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

export function Header() {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  
  const navKeys = ["home", "features", "explore", "about"];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-10 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
        <div className="relative size-8 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Ideological Atlas Logo" 
            width={32} 
            height={32} 
            className="object-contain"
          />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{tCommon("ideological_atlas")}</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8 hidden lg:flex">
        <div className="flex items-center gap-9">
          {navKeys.map((key) => {
            const isActive = key === "home";
            return (
              <Link
                key={key}
                className={clsx(
                  "text-sm leading-normal transition-colors",
                  isActive 
                    ? "text-primary font-bold" 
                    : "text-slate-600 dark:text-slate-300 hover:text-primary font-medium"
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
            {tCommon("get_started")}
          </Button>
          <Button variant="secondary" className="max-w-[480px]">
            {tCommon("sign_in")}
          </Button>
        </div>
      </div>
      <div className="lg:hidden flex items-center text-slate-900 dark:text-white">
        <span className="material-symbols-outlined">menu</span>
      </div>
    </header>
  );
}
