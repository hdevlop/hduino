'use client';

import { useState } from 'react';
import { FileCode, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodePanelHeaderProps {
  onCopy: () => void;
  onClose: () => void;
}

export function CodePanelHeader({ onCopy, onClose }: CodePanelHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">

      <div className="flex items-center gap-2">
        <FileCode className="w-4 h-4 text-white/70" />
        <span className="font-medium text-sm text-white">Arduino Code</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 h-auto py-1 px-2"
          onClick={handleCopy}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              Copied
            </span>
          ) : (
            'Copy'
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-full"
          onClick={onClose}
        >
          <X className="w-3 h-3 text-red-400" />
        </Button>
      </div>
    </div>
  );
}
