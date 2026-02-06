'use client';

import { CodePanelHeader } from './CodePanelHeader';
import { CodeContent } from './CodeContent';

interface CodePanelProps {
  code: string;
  onCopy: () => void;
  onClose: () => void;
}

export function CodePanel({ code, onCopy, onClose }: CodePanelProps) {
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="
        absolute z-50 flex flex-col bg-[#12121a] shadow-2xl border border-white/10 rounded-2xl

        /* Mobile: centered with margin */
        left-4 right-4 top-1/2 -translate-y-1/2 h-[85vh] max-h-200
        animate-in slide-in-from-bottom duration-300 ease-out

        /* Desktop: right side panel */
        lg:left-auto lg:right-10 lg:top-10 lg:translate-y-0 lg:w-96 lg:h-4/5 lg:max-h-none
        lg:slide-in-from-right lg:slide-in-from-bottom-0
      "
      onMouseDown={handlePanelMouseDown}
    >
      <CodePanelHeader onCopy={onCopy} onClose={onClose} />
      <CodeContent code={code} />
    </div>
  );
}
