'use client';

import Image from 'next/image';
import { ToolbarButton } from './ToolbarButton';
import codeImg from '@/assets/img/code.png';

interface CodePanelButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CodePanelButton({ isOpen, onToggle }: CodePanelButtonProps) {
  return (
    <ToolbarButton
      onClick={onToggle}
      active={isOpen}
      tooltip="Toggle code panel"
    >
      <Image src={codeImg} alt="Code" width={26} height={26} unoptimized={false} />
    </ToolbarButton>
  );
}
