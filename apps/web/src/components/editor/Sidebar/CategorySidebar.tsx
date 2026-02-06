'use client';

import Image from 'next/image';
import { CategoryItem } from './CategoryItem';
import { LOGIC_CATEGORIES, HARDWARE_CATEGORIES } from '@/constants/categories';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import homeImg from '@/assets/img/house.png';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategorySidebar({ selectedCategory, onSelectCategory }: CategorySidebarProps) {
  const router = useRouter();

  const handleHome = () => {
    router.push('/projects');
  };

  return (
    <aside className="flex w-16 lg:w-40 h-full bg-card p-2 flex-col gap-2 overflow-y-auto" >
      {/* Logic Categories */}
      {LOGIC_CATEGORIES.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={() => onSelectCategory(category.id)}
        />
      ))}

      {/* Separator */}
      <div className="h-px bg-border my-2" />

      {/* Hardware Categories */}
      {HARDWARE_CATEGORIES.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={() => onSelectCategory(category.id)}
        />
      ))}

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
