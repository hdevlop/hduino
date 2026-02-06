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
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface VerifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: 'idle' | 'compiling' | 'success' | 'error';
  message?: string;
  error?: string;
}

export function VerifyDialog({
  open,
  onOpenChange,
  status,
  message,
  error,
}: VerifyDialogProps) {
  const isCompiling = status === 'compiling';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompiling && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                Verifying Code
              </>
            )}
            {isSuccess && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Verification Successful
              </>
            )}
            {isError && (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Verification Failed
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompiling && 'Compiling your Arduino code...'}
            {isSuccess && 'Your code compiled without errors'}
            {isError && 'Compilation failed with errors'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress bar while compiling */}
          {isCompiling && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Please wait...
              </p>
            </div>
          )}

          {/* Success message */}
          {isSuccess && message && (
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono text-foreground">
                {message}
              </pre>
            </div>
          )}

          {/* Error message */}
          {isError && error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900 max-h-[400px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono text-red-700 dark:text-red-400">
                {error}
              </pre>
            </div>
          )}

          {/* Close button (only show when not compiling) */}
          {!isCompiling && (
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
