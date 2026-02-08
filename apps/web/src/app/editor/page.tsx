'use client';

import { useEditorStore } from '@/stores/editorStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { EditorToolbar } from '@/components/editor/Toolbar';
import { TitleBar } from '@/components/editor/TitleBar';

import { useEffect, useRef } from 'react';
import { CategorySidebar, CodePanel, WorkspaceContainer, VariableDialog } from '@/components/editor';
import useOnClickOutside from 'use-onclickoutside';

export default function EditorPage() {
  const {
    currentProject: project,
    isDirty,
    generatedCode,
    selectedCategory,
    isCodePanelOpen,
    closeProject,
    selectCategory,
    toggleCodePanel,
    copyCodeToClipboard,
    undo,
    redo,
  } = useEditorStore();

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Enable auto-save
  useAutoSave();

  // Close flyout when clicking outside sidebar and flyout
  useOnClickOutside(sidebarRef, () => {
    if (selectedCategory) {
      selectCategory(null);
    }
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // If no project loaded yet, don't render
  if (!project) {
    return null;
  }

  const handleCopyCode = async () => {
    await copyCodeToClipboard();
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        {/* Custom Title Bar (only visible in Tauri desktop app) */}
        <TitleBar />

        <EditorToolbar
          project={project}
          isDirty={isDirty}
          isCodePanelOpen={isCodePanelOpen}
          onToggleCodePanel={toggleCodePanel}
          onClose={closeProject}
        />


        <div className="flex relative flex-1 overflow-hidden h-full">

          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(categoryId) => {
              if (categoryId === selectedCategory) {
                selectCategory(null);
              } else {
                selectCategory(categoryId);
              }
            }}
          />

          <WorkspaceContainer />


          {isCodePanelOpen && (
            <CodePanel
              code={generatedCode}
              onCopy={handleCopyCode}
              onClose={toggleCodePanel}
            />
          )}
        </div>
      </div>

      {/* Variable Dialog - follows same pattern as ProjectDialog/DeleteConfirmDialog */}
      <VariableDialog />
    </>
  );
}
