'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ToolbarButton } from './ToolbarButton';
import { PortSelectionDialog } from './PortSelectionDialog';
import { useEditorStore } from '@/stores/editorStore';
import serialImg from '@/assets/img/serial.png';

export function SelectPortButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedPort, setSelectedPort } = useEditorStore();

  const handleSelectPort = () => {
    setIsDialogOpen(true);
  };

  const handlePortSelect = (port: string) => {
    setSelectedPort(port);
  };

  return (
    <>
      <ToolbarButton onClick={handleSelectPort} tooltip={selectedPort || 'Select port'}>
        <Image src={serialImg} alt="Serial" width={26} height={26} unoptimized={false} />
      </ToolbarButton>

      <PortSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentPort={selectedPort}
        onPortSelect={handlePortSelect}
      />
    </>
  );
}
