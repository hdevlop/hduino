'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToolbarButton } from './ToolbarButton';
import homeImg from '@/assets/img/house.png';
import { useEditorStore } from '@/stores/editorStore';
import { toast } from 'sonner';

export function HomeButton() {
  const router = useRouter();
  const { isDirty, saveProject } = useEditorStore();

  const handleHome = async () => {
    // Auto-save if there are unsaved changes
    if (isDirty) {
      try {
        await saveProject(true); // true = isAutoSave
        toast.success('Auto-saved', {
          description: 'Your work has been saved before navigating',
          duration: 2000,
        });
      } catch (error) {
        console.error('[HomeButton] Failed to auto-save:', error);
      }
    }

    router.push('/projects');
  };

  return (
    <ToolbarButton onClick={handleHome} tooltip="Back to Projects">
      <Image src={homeImg} alt="Home" width={24} height={24} unoptimized={false} />
    </ToolbarButton>
  );
}