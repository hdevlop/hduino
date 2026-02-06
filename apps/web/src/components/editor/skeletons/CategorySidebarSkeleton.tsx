'use client';

import { Skeleton } from '@/components/shared/skeleton';

export function CategorySidebarSkeleton() {
  // 7 logic categories + 6 hardware categories = 13 items
  const logicItems = 7;
  const hardwareItems = 6;

  return (
    <aside className="w-40 h-full bg-card p-2 flex flex-col gap-2 overflow-y-auto">
      {/* Logic Categories */}
      {Array.from({ length: logicItems }).map((_, i) => (
        <Skeleton key={`logic-${i}`} className="w-full h-10 rounded-lg" />
      ))}

      {/* Visual gap between groups */}
      <div className="h-2" />

      {/* Hardware Categories */}
      {Array.from({ length: hardwareItems }).map((_, i) => (
        <Skeleton key={`hardware-${i}`} className="w-full h-10 rounded-lg" />
      ))}
    </aside>
  );
}
