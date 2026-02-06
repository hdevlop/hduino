'use client';

import { useBlockly } from '@/hooks/useBlockly';
import { WorkspaceControls } from './WorkspaceControls';

interface WorkspaceContainerProps {
  children?: React.ReactNode;
}

export function WorkspaceContainer({ children }: WorkspaceContainerProps) {
  const { divId } = useBlockly();
  
  return (
    <div className="flex-1 border-0 relative">
      <div id={divId} />
      <WorkspaceControls />
      {children}
    </div>
  );
}
