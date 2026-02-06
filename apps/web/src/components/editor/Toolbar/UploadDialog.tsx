'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Upload, Cpu } from 'lucide-react';
import type { UploadProgress } from '@/hooks/useUpload';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: 'idle' | 'compiling' | 'uploading' | 'success' | 'error';
  progress: UploadProgress;
  message?: string;
  error?: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  status,
  progress,
  message,
  error,
}: UploadDialogProps) {
  const isCompiling = status === 'compiling';
  const isUploading = status === 'uploading';
  const isInProgress = isCompiling || isUploading;
  const isSuccess = status === 'success';
  const isError = status === 'error';

  // Calculate display progress (compiling: 0-50%, uploading: 50-100%)
  const displayProgress = isCompiling
    ? progress.percent / 2
    : isUploading
      ? 50 + progress.percent / 2
      : isSuccess
        ? 100
        : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompiling && (
              <>
                <Cpu className="h-5 w-5 text-blue-500 animate-pulse" />
                Compiling Code
              </>
            )}
            {isUploading && (
              <>
                <Upload className="h-5 w-5 text-blue-500 animate-pulse" />
                Uploading to Board
              </>
            )}
            {isSuccess && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Upload Successful
              </>
            )}
            {isError && (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Upload Failed
              </>
            )}
            {status === 'idle' && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                Preparing...
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompiling && 'Compiling your Arduino code...'}
            {isUploading && 'Uploading compiled code to the board...'}
            {isSuccess && 'Your code has been uploaded successfully!'}
            {isError && 'Upload failed - check the error below'}
            {status === 'idle' && 'Initializing upload process...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress bar while compiling/uploading */}
          {isInProgress && (
            <div className="space-y-3">
              <Progress value={displayProgress} className="w-full h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  {isCompiling ? (
                    <>
                      <Cpu className="h-4 w-4" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Uploading...
                    </>
                  )}
                </span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
              {progress.message && (
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {progress.message}
                </p>
              )}
            </div>
          )}

          {/* Success message */}
          {isSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-700 dark:text-green-400">
                {message || 'Code uploaded successfully! Your Arduino is now running the new program.'}
              </p>
            </div>
          )}

          {/* Error message */}
          {isError && error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900 max-h-[300px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono text-red-700 dark:text-red-400">
                {error}
              </pre>
            </div>
          )}

          {/* Close button (only show when not in progress) */}
          {!isInProgress && (
            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)} variant="default">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
