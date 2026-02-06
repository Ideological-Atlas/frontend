interface AtlasTemplateProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AtlasTemplate({ sidebar, children }: AtlasTemplateProps) {
  return (
    <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-8 md:px-10 lg:flex-row">
      <aside className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">{sidebar}</aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8">{children}</main>
    </div>
  );
}
