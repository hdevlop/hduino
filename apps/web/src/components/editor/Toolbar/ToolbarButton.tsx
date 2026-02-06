'use client';

import { Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  variant?: 'default' | 'verify' | 'upload' | 'danger';
  tooltip: string;
  className?: string;
  children: React.ReactNode;
}

export function ToolbarButton({
  onClick,
  disabled,
  loading,
  tooltip,
  className,
  children,
}: ToolbarButtonProps) {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled || loading}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-full bg-black transition-colors',
            'disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
            className
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            children
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
