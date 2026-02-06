'use client';

import { Skeleton } from '@/components/shared/skeleton';

export function ToolbarSkeleton() {
  return (
    <header className="h-12 w-full bg-card border-b border-white/10 flex items-center justify-between px-4">
      {/* Left section: Home + Project */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-32 h-9 rounded-lg" />
      </div>

      {/* Center section: Verify + Upload */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-24 h-9 rounded-lg" />
        <Skeleton className="w-24 h-9 rounded-lg" />
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-28 h-9 rounded-lg" />
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-28 h-9 rounded-lg" />
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>
    </header>
  );
}
