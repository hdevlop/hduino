'use client';

import { ToolbarSkeleton } from './ToolbarSkeleton';
import { CategorySidebarSkeleton } from './CategorySidebarSkeleton';
import { WorkspaceSkeleton } from './WorkspaceSkeleton';

export function EditorSkeleton() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Toolbar Skeleton - Full Width */}
      <ToolbarSkeleton />

      {/* Sidebar + Workspace - Side by Side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar Skeleton */}
        <CategorySidebarSkeleton />

        {/* Workspace Skeleton */}
        <WorkspaceSkeleton />
      </div>
    </div>
  );
}
