'use client';

import { cn } from '@/lib/utils';
import type { BlockCategory } from '@/types/editor';

interface CategoryItemProps {
  category: BlockCategory;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryItem({ category, isSelected, onClick }: CategoryItemProps) {
  return (
    <button
      className={cn('flex items-center w-full min-h-10 rounded-md lg:rounded-2xl transition-colors cursor-pointer text-white font-medium text-sm overflow-hidden shrink-0',
        isSelected && 'ring-2 ring-white/50'
      )}
      onClick={onClick}
    >
      <div
        className="hidden lg:block w-6 h-full"
        style={{
          backgroundColor: isSelected ? category.hoverColor : category.color,
        }}
      />
      <div className="flex items-center gap-2 flex-1 bg-black px-2 py-2 justify-center lg:justify-start">
        <category.icon className="w-6 h-6 shrink-0" />
        <span className="hidden lg:inline truncate">{category.name}</span>
      </div>
    </button>
  );
}
