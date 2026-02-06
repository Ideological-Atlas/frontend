import { Skeleton } from '@/components/atoms/Skeleton';

export function AtlasSkeleton() {
  return (
    <div className="layout-content-container mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-8 md:px-10 lg:flex-row">
      <aside className="w-full lg:w-[280px] lg:shrink-0">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </aside>
      <main className="flex-1 space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </main>
    </div>
  );
}
