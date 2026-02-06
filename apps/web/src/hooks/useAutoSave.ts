import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { toast } from 'sonner';

const AUTO_SAVE_DELAY = 3000; // 3 seconds after last change

export function useAutoSave() {
  const { isDirty, saveProject, currentProject } = useEditorStore();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Auto-save after inactivity
  useEffect(() => {
    if (!currentProject || !isDirty || isSavingRef.current) {
      return;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      isSavingRef.current = true;
      try {
        await saveProject(true); // true = isAutoSave
      } finally {
        isSavingRef.current = false;
      }
    }, AUTO_SAVE_DELAY);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, currentProject, saveProject]);

  // Auto-save on page unload/navigation
  useEffect(() => {
    if (!currentProject) return;

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (isDirty && !isSavingRef.current) {
        // Prevent default to show browser dialog
        e.preventDefault();

        isSavingRef.current = true;

        // Attempt synchronous save
        try {
          await saveProject(true);
          toast.success('Auto-saved', {
            description: 'Your work has been saved',
            duration: 2000,
          });
        } catch (error) {
          console.error('[useAutoSave] Failed to save on unload:', error);
          toast.error('Failed to save', {
            description: 'Could not save your changes',
          });
        } finally {
          isSavingRef.current = false;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, currentProject, saveProject]);
}
