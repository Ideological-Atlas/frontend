interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card text-card-foreground border-border flex flex-1 flex-col gap-4 rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-primary bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl leading-tight font-bold">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed font-normal">{description}</p>
      </div>
    </div>
  );
}
