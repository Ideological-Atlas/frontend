interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-6 flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="text-primary w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
