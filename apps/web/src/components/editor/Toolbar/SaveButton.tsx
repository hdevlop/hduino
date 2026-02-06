'use client';

import Image from 'next/image';
import { ToolbarButton } from './ToolbarButton';
import saveImg from '@/assets/img/save.png';

interface SaveButtonProps {
  isDirty: boolean;
  onSave: () => void;
}

export function SaveButton({ isDirty, onSave }: SaveButtonProps) {
  return (
    <ToolbarButton
      onClick={onSave}
      disabled={!isDirty}
      tooltip="Save project (Ctrl+S)"
    >
      <Image src={saveImg} alt="Save" width={26} height={26} unoptimized={false} />
    </ToolbarButton>
  );
}
