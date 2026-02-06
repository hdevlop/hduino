'use client';

import { Loader2 } from 'lucide-react';

export function WorkspaceSkeleton() {
  // Matches Blockly workspace background color from theme.ts
  return (
    <div className="flex-1 bg-[#1e1e1e] border-0 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
    </div>
  );
}
