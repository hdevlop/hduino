'use client';

import { X, Minus, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __TAURI__?: {
      window: {
        getCurrentWindow: () => {
          close: () => Promise<void>;
          minimize: () => Promise<void>;
          toggleMaximize: () => Promise<void>;
        };
      };
    };
  }
}

export function TitleBar() {
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    // Check if running in Tauri
    setIsTauri(typeof window !== 'undefined' && '__TAURI__' in window);
  }, []);

  // Don't render title bar if not in Tauri (web version)
  if (!isTauri) {
    return null;
  }

  const handleMinimize = async () => {
    if (window.__TAURI__) {
      const currentWindow = window.__TAURI__.window.getCurrentWindow();
      await currentWindow.minimize();
    }
  };

  const handleMaximize = async () => {
    if (window.__TAURI__) {
      const currentWindow = window.__TAURI__.window.getCurrentWindow();
      await currentWindow.toggleMaximize();
    }
  };

  const handleClose = async () => {
    if (window.__TAURI__) {
      const currentWindow = window.__TAURI__.window.getCurrentWindow();
      await currentWindow.close();
    }
  };

  return (
    <div
      data-tauri-drag-region
      className="h-7 w-full bg-background border-b border-white/5 flex items-center justify-center relative select-none"
    >
      {/* Center: Title Text */}
      <span data-tauri-drag-region className="text-xs font-semibold text-muted-foreground">
        Hduino - Visual Programming IDE for Arduino
      </span>

      {/* Right: Window Controls (absolute positioning) */}
      <div className="absolute right-0 flex items-center">
        {/* Minimize Button */}
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center hover:bg-white/5 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Maximize Button */}
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center hover:bg-white/5 transition-colors"
          aria-label="Maximize"
        >
          <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center hover:bg-red-500/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-white" />
        </button>
      </div>
    </div>
  );
}
