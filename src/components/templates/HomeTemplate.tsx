import { ReactNode } from 'react';

interface HomeTemplateProps {
  hero: ReactNode;
  features: ReactNode;
  cta: ReactNode;
}

export function HomeTemplate({ hero, features, cta }: HomeTemplateProps) {
  return (
    <div className="layout-container flex w-full flex-col">
      <section className="w-full">{hero}</section>

      <section className="w-full">{features}</section>

      <section className="w-full">{cta}</section>
    </div>
  );
}
