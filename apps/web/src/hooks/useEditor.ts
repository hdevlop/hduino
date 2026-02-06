'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';

export function useEditor(projectId: string) {
  const store = useEditorStore();

  // Load project on mount
  useEffect(() => {
    store.loadProject(projectId);
    return () => store.reset();
  }, [projectId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        store.saveProject();
      }
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        store.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    project: store.currentProject,
    isLoading: store.isLoading,
    error: store.error,
    isDirty: store.isDirty,
    generatedCode: store.generatedCode,
    selectedCategory: store.selectedCategory,
    isCodePanelOpen: store.isCodePanelOpen,
    zoomLevel: store.zoomLevel,
    workspaceXml: store.workspaceXml,
    // Actions
    saveProject: store.saveProject,
    closeProject: store.closeProject,
    setWorkspaceXml: store.setWorkspaceXml,
    markDirty: store.markDirty,
    markClean: store.markClean,
    setGeneratedCode: store.setGeneratedCode,
    copyCodeToClipboard: store.copyCodeToClipboard,
    selectCategory: store.selectCategory,
    toggleCodePanel: store.toggleCodePanel,
    zoomIn: store.zoomIn,
    zoomOut: store.zoomOut,
    resetZoom: store.resetZoom,
    centerWorkspace: store.centerWorkspace,
    undo: store.undo,
    redo: store.redo,
  };
}
