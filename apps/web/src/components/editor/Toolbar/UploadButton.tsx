'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { OctagonXIcon } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { UploadDialog } from './UploadDialog';
import { useEditorStore } from '@/stores/editorStore';
import { useUpload } from '@/hooks/useUpload';
import { BOARD_PROFILES } from '@hduino/arduino';
import uploadImg from '@/assets/img/upload.png';

type UploadStatus = 'idle' | 'compiling' | 'uploading' | 'success' | 'error';

export function UploadButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { generatedCode, currentProject, selectedPort } = useEditorStore();
  const { upload, progress, canUpload } = useUpload();

  const handleUpload = async () => {
    // Check if project is loaded
    if (!currentProject) {
      toast.error('No project loaded', {
        description: 'Please open or create a project first',
        icon: <OctagonXIcon className="h-5 w-5" />,
      });
      return;
    }

    // Check if platform supports upload
    if (!canUpload) {
      toast.error('Upload not supported', {
        description: 'Please use the desktop app to upload code',
        icon: <OctagonXIcon className="h-5 w-5" />,
        duration: 4000,
      });
      return;
    }

    // Check if a port is selected
    if (!selectedPort) {
      toast.error('No port selected', {
        description: 'Please select a serial port first',
        icon: <OctagonXIcon className="h-5 w-5" />,
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

    // Open dialog and start upload
    setDialogOpen(true);
    setStatus('compiling');
    setResultMessage('');
    setErrorMessage('');

    try {
      const result = await upload(selectedPort, generatedCode, boardProfile.compilerFlag);

      if (result.success) {
        setStatus('success');
        setResultMessage(result.message || 'Code uploaded successfully!');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Upload failed with unknown error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  };

  // Update status based on progress from useUpload hook
  const currentStatus: UploadStatus =
    progress.stage === 'compiling' ? 'compiling' :
    progress.stage === 'uploading' ? 'uploading' :
    status;

  return (
    <>
      <ToolbarButton
        onClick={handleUpload}
        loading={currentStatus === 'compiling' || currentStatus === 'uploading'}
        tooltip="Upload to board"
        className="w-10 h-10"
      >
        <Image src={uploadImg} alt="Upload" width={26} height={26} unoptimized={false} />
      </ToolbarButton>

      <UploadDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            // Reset status when dialog closes
            setStatus('idle');
          }
        }}
        status={currentStatus}
        progress={progress}
        message={resultMessage}
        error={errorMessage}
      />
    </>
  );
}
