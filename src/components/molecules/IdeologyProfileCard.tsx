import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';

interface IdeologyProfileCardProps {
  name: string;
  color: string;
  flag?: string | null;
  tags: { uuid: string; name: string }[];
  location: string;
  religion: string;
  onReadArticle: () => void;
}

export function IdeologyProfileCard({
  name,
  color,
  flag,
  tags,
  location,
  religion,
  onReadArticle,
}: IdeologyProfileCardProps) {
  const tEnc = useTranslations('Encyclopedia');

  return (
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-xl">
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: color }} />
        {flag && <Image src={flag} alt={name} fill className="object-cover opacity-60 mix-blend-overlay" unoptimized />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute top-4 right-4 left-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag.uuid}
              className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-bold tracking-wide text-white/90 uppercase backdrop-blur-md"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <h1 className="text-3xl leading-none font-black text-white shadow-black drop-shadow-md">{name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="bg-secondary/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
          <div className="text-muted-foreground flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{tEnc('location_label')}</span>
          </div>
          <span className="truncate text-sm font-bold" title={location}>
            {location}
          </span>
        </div>
        <div className="bg-secondary/50 border-border/50 flex flex-col gap-1 rounded-xl border p-3">
          <div className="text-muted-foreground flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">temple_buddhist</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{tEnc('religion_label')}</span>
          </div>
          <span className="truncate text-sm font-bold" title={religion}>
            {religion}
          </span>
        </div>
      </div>

      <div className="p-4 pt-0 pb-6">
        <Button
          variant="primary"
          className="bg-accent-strong shadow-accent-strong/20 hover:bg-accent-strong-hover hover:shadow-accent-strong/40 group relative w-full justify-center gap-2 overflow-hidden py-6 text-sm font-bold text-white shadow-lg transition-all"
          onClick={onReadArticle}
        >
          <span>{tEnc('read_full_article')}</span>
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Button>
      </div>
    </div>
  );
}
