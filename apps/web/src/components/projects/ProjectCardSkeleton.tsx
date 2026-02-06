'use client'

import { Skeleton } from '@/components/shared/skeleton'
import { cn } from '@/lib/utils'

export function ProjectCardSkeleton() {
  return (
    <div
      className={cn(
        'relative p-4 rounded-lg',
        'bg-card border border-border'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-5 flex-1 max-w-[70%]" />
        </div>

        {/* Menu button skeleton */}
        <Skeleton className="h-7 w-7 shrink-0" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}
