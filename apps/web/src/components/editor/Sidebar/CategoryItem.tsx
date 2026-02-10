'use client';

import { cn } from '@/lib/utils';
import type { BlockCategory } from '@/types/editor';
import { ChevronRight } from 'lucide-react';

interface CategoryItemProps {
  category: BlockCategory;
  isSelected: boolean;
  onClick: () => void;
  isChild?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

export function CategoryItem({ category, isSelected, onClick, isChild = false, hasChildren = false, isExpanded = false }: CategoryItemProps) {
  return (
    <button
      className={cn('flex items-center w-full min-h-10 rounded-md lg:rounded-2xl transition-colors cursor-pointer text-white font-medium text-sm overflow-hidden shrink-0',
        isSelected && 'ring-2 ring-white/50',
        isChild && 'min-h-8'
      )}
      onClick={onClick}
    >
      <div
        className="hidden lg:block w-6 h-10"
        style={{
          backgroundColor: isSelected ? category.hoverColor : category.color,
        }}
      />
      <div className={cn('flex items-center gap-2 flex-1 bg-black px-2 py-2 justify-center lg:justify-start',
        isChild && 'lg:pl-8'
      )}>
        {hasChildren && (
          <ChevronRight className={cn('w-4 h-4 shrink-0 transition-transform hidden lg:block', isExpanded && 'rotate-90')} />
        )}
        {!isChild && <category.icon className="w-6 h-6 shrink-0" />}
        {isChild && <span className="hidden lg:inline w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />}
        <span className={cn('hidden lg:inline truncate', isChild && 'text-xs')}>{category.name}</span>
      </div>
    </button>
  );
}
