'use client';

import { ZoomIn, ZoomOut, Undo, Redo, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorStore } from '@/stores/editorStore';

export function WorkspaceControls() {
  const { zoomIn, zoomOut, undo, redo, centerWorkspace } = useEditorStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <TooltipProvider>
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-lg"
        onMouseDown={handleMouseDown}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-white/10"
              onClick={zoomIn}
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom in</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-white/10"
              onClick={zoomOut}
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom out</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-white/20" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-white/10"
              onClick={undo}
            >
              <Undo className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-white/10"
              onClick={redo}
            >
              <Redo className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-white/10"
              onClick={centerWorkspace}
            >
              <Crosshair className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Center view</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
