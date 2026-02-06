'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/stores/editorStore';
import type { Project } from '@/types/project';

interface ProjectButtonProps {
  project: Project;
  isDirty: boolean;
}

export function ProjectButton({ project, isDirty }: ProjectButtonProps) {
  const { isSaving } = useEditorStore();


  const handleRename = () => {
  };

  const handleExportHduino = async () => {

  };

  const handleExportIno = () => {

  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer w-auto min-w-32'>
        <button className="flex items-center justify-around gap-1 px-3 py-1.5 w-32 rounded-lg bg-black/60 hover:bg-black/80 transition-colors">
          <div className='flex gap-1 justify-start items-center w-full'>
            <span className="font-medium text-white">{project.name}</span>
            {isSaving ? (
              <span title="Saving...">
                <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
              </span>
            ) : (
              <span
                className={`w-2 h-2 bg-orange-500 rounded-full ${isDirty ? 'visible' : 'invisible'}`}
                title="Unsaved changes"
              />
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-white/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={handleRename}>
          Rename project
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportHduino}>
          Export as .hd
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportIno}>
          Export as .ino
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
