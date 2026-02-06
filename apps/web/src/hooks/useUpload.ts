'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdapter, type UploadResult } from '@hduino/platform';

/**
 * Upload progress state
 */
export interface UploadProgress {
  stage: 'compiling' | 'uploading' | 'idle';
  percent: number;
  message?: string;
}

/**
 * Upload hook state
 */
export interface UseUploadState {
  progress: UploadProgress;
  isUploading: boolean;
  lastResult: UploadResult | null;
  error: string | null;
}

/**
 * Upload hook return type
 */
export interface UseUploadReturn extends UseUploadState {
  upload: (port: string, code: string, board: string) => Promise<UploadResult>;
  reset: () => void;
  canUpload: boolean;
}

/**
 * Hook for uploading Arduino code with progress tracking
 *
 * Usage:
 * ```tsx
 * const { upload, progress, isUploading, canUpload } = useUpload();
 *
 * const handleUpload = async () => {
 *   const result = await upload('/dev/ttyUSB0', code, 'arduino:avr:uno');
 *   if (result.success) {
 *     toast.success('Upload complete!');
 *   } else {
 *     toast.error(result.error || 'Upload failed');
 *   }
 * };
 * ```
 */
export function useUpload(): UseUploadReturn {
  const [state, setState] = useState<UseUploadState>({
    progress: { stage: 'idle', percent: 0 },
    isUploading: false,
    lastResult: null,
    error: null,
  });

  const [canUpload, setCanUpload] = useState(false);

  // Check if upload is supported on the current platform
  useEffect(() => {
    const adapter = getAdapter();
    const capabilities = adapter.getCapabilities();
    setCanUpload(capabilities.canUpload);
  }, []);

  // Listen for Tauri events for progress updates
  useEffect(() => {
    // Only set up listener if we're in Tauri and uploading
    if (typeof window === 'undefined') return;

    const tauri = (window as any).__TAURI__;
    if (!tauri?.event?.listen) return;

    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await tauri.event.listen(
        'compile-progress',
        (event: { payload: { stage: string; percent: number; message: string } }) => {
          const { stage, percent, message } = event.payload;
          // Only update progress if we're actually uploading
          setState((prev) => {
            if (!prev.isUploading) {
              return prev; // Ignore events when not uploading
            }
            return {
              ...prev,
              progress: {
                stage: stage as 'compiling' | 'uploading',
                percent,
                message,
              },
            };
          });
        }
      );
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  /**
   * Upload code to Arduino
   */
  const upload = useCallback(
    async (port: string, code: string, board: string): Promise<UploadResult> => {
      const adapter = getAdapter();

      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        progress: { stage: 'compiling', percent: 0 },
        lastResult: null,
      }));

      try {
        const result = await adapter.upload(port, code, board, (stage, percent) => {
          setState((prev) => ({
            ...prev,
            progress: { stage, percent },
          }));
        });

        setState((prev) => ({
          ...prev,
          isUploading: false,
          lastResult: result,
          progress: result.success
            ? { stage: 'idle', percent: 100 }
            : { stage: 'idle', percent: 0 },
          error: result.error || null,
        }));

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: errorMessage,
          progress: { stage: 'idle', percent: 0 },
          lastResult: {
            success: false,
            error: errorMessage,
          },
        }));

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  /**
   * Reset the upload state
   */
  const reset = useCallback(() => {
    setState({
      progress: { stage: 'idle', percent: 0 },
      isUploading: false,
      lastResult: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    upload,
    reset,
    canUpload,
  };
}
