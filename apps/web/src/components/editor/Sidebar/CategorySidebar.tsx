'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CategoryItem } from './CategoryItem';
import { LOGIC_CATEGORIES, HARDWARE_CATEGORIES } from '@/constants/categories';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import homeImg from '@/assets/img/house.png';
import type { BlockCategory } from '@/types/editor';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategorySidebar({ selectedCategory, onSelectCategory }: CategorySidebarProps) {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleHome = () => {
    router.push('/projects');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategory = (category: BlockCategory) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <CategoryItem
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={() => {
            if (hasChildren) {
              toggleCategory(category.id);
            } else {
              onSelectCategory(category.id);
            }
          }}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
        />
        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-1 mt-1">
            {category.children!.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                isSelected={selectedCategory === child.id}
                onClick={() => onSelectCategory(child.id)}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex w-16 lg:w-40 h-full bg-card p-2 flex-col gap-2 overflow-y-auto" >
      {/* Logic Categories */}
      {LOGIC_CATEGORIES.map((category) => renderCategory(category))}

      {/* Separator */}
      <div className="h-px bg-border my-2" />

      {/* Hardware Categories */}
      {HARDWARE_CATEGORIES.map((category) => renderCategory(category))}

      {/* Home Button - Mobile Only */}
      <div className="lg:hidden mt-auto pt-2">
        <button
          onClick={handleHome}
          className="flex items-center justify-center w-full min-h-10 rounded-md transition-colors cursor-pointer bg-card hover:bg-card/80 border border-border shrink-0"
          title="Back to Projects"
        >
          <Image src={homeImg} alt="Home" width={24} height={24} unoptimized={false} />
        </button>
      </div>
    </aside>
  );
}
