'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editorStore';
import { EditorSkeleton } from '@/components/editor';

function EditorContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('id');

  const { currentProject, error, loadProject } = useEditorStore();

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }

    // Cleanup when navigating away or changing projects
    return () => {
      // Reset editor state to prevent data from one project bleeding into another
      useEditorStore.getState().reset();
    };
  }, [projectId, loadProject]);

  // Error state - only show if loadProject set an error
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a2e]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Show skeleton until project is loaded
  if (!currentProject) {
    return <EditorSkeleton />;
  }

  // Render children when project is loaded
  return <>{children}</>;
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorContent>{children}</EditorContent>
    </Suspense>
  );
}
