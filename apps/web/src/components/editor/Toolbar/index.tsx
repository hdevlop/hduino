'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { HomeButton } from './HomeButton';
import { ProjectButton } from './ProjectButton';
import { VerifyButton } from './VerifyButton';
import { UploadButton } from './UploadButton';
import { CodePanelButton } from './CodePanelButton';
import { SelectBoardButton } from './SelectBoardButton';
import { SelectPortButton } from './SelectPortButton';
import type { Project } from '@/types/project';

interface EditorToolbarProps {
  project: Project;
  isDirty: boolean;
  isCodePanelOpen: boolean;
  onToggleCodePanel: () => void;
  onClose: () => void;
}

export function EditorToolbar({
  project,
  isDirty,
  isCodePanelOpen,
  onToggleCodePanel,
}: EditorToolbarProps) {
  return (
    <header className="h-12 w-full bg-card border-b border-white/10 flex items-center justify-between px-4">
      <TooltipProvider>
        {/* Left section: Home + Project */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <HomeButton />
          </div>
          <ProjectButton project={project} isDirty={isDirty} />
        </div>

        {/* Center section: Verify + Upload */}
        <div className="flex items-center gap-3">
          <VerifyButton />
          <UploadButton />
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-3">
          <SelectPortButton />
          <CodePanelButton isOpen={isCodePanelOpen} onToggle={onToggleCodePanel} />
          <SelectBoardButton />
        </div>
      </TooltipProvider>
    </header>
  );
}
