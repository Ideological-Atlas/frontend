interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="dark:bg-surface-dark flex flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
      <div className="text-primary bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl leading-tight font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm leading-relaxed font-normal text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
