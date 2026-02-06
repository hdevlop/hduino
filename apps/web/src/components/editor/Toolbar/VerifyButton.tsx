'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { OctagonXIcon } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { VerifyDialog } from './VerifyDialog';
import { useEditorStore } from '@/stores/editorStore';
import { BOARD_PROFILES } from '@hduino/arduino';
import { getAdapter } from '@hduino/platform';
import verifyImg from '@/assets/img/verify.png';

type VerifyStatus = 'idle' | 'compiling' | 'success' | 'error';

export function VerifyButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { generatedCode, currentProject } = useEditorStore();

  const handleVerify = async () => {
    if (!currentProject) {
      toast.error('No project loaded', {
        description: 'Please open or create a project first',
        icon: <OctagonXIcon className="h-5 w-5" />,
      });
      return;
    }

    const adapter = getAdapter();
    const capabilities = adapter.getCapabilities();

    // Check if platform supports compilation
    if (!capabilities.canUpload) {
      toast.error('Verification not supported', {
        description: 'Please use the desktop app to verify code',
        icon: <OctagonXIcon className="h-5 w-5" />,
        duration: 4000,
      });
      return;
    }

    // Get the board FQBN (compilerFlag)
    const boardProfile = BOARD_PROFILES[currentProject.boardType];
    if (!boardProfile) {
      toast.error('Invalid board type', {
        description: `Board type "${currentProject.boardType}" not found`,
        icon: <OctagonXIcon className="h-5 w-5" />,
      });
      return;
    }

    // Open dialog and start compilation
    setDialogOpen(true);
    setStatus('compiling');
    setResultMessage('');
    setErrorMessage('');

    try {
      // Compile the code
      const result = await adapter.compile(generatedCode, boardProfile.compilerFlag);

      if (result.success) {
        setStatus('success');
        setResultMessage(
          result.message ||
          'Compilation successful!\n\nYour Arduino code is ready to upload.'
        );
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Compilation failed with unknown error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  };

  return (
    <>
      <ToolbarButton
        onClick={handleVerify}
        loading={status === 'compiling'}
        tooltip="Verify code"
        className="w-10 h-10"
      >
        <Image src={verifyImg} alt="Verify" width={26} height={26} unoptimized={false} />
      </ToolbarButton>

      <VerifyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            // Reset status when dialog closes
            setStatus('idle');
          }
        }}
        status={status}
        message={resultMessage}
        error={errorMessage}
      />
    </>
  );
}
