'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ToolbarButton } from './ToolbarButton';
import { BoardSelectionDialog } from './BoardSelectionDialog';
import { useEditorStore } from '@/stores/editorStore';
import chipImg from '@/assets/img/chip.png';

export function SelectBoardButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentProject, updateBoardType, isLoading } = useEditorStore();

  const handleSelectBoard = () => {
    setIsDialogOpen(true);
  };

  if (!currentProject) return null;

  return (
    <>
      <ToolbarButton onClick={handleSelectBoard} tooltip="Select Arduino board">
        <Image src={chipImg} alt="Select Board" width={26} height={26} unoptimized={false} />
      </ToolbarButton>

      <BoardSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentBoard={currentProject.boardType}
        onBoardChange={updateBoardType}
        isLoading={isLoading}
      />
    </>
  );
}
