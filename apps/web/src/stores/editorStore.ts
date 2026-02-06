import { create } from 'zustand';
import type * as Blockly from 'blockly';
import type { Project } from '@/types/project';
import type { BoardType } from '@/types/arduino';
import { getProject, updateProject } from '@/lib/storage';
import { EDITOR_CONFIG } from '@/constants/editorConfig';
import { changeBoard } from '@hduino/arduino/arduino';
import { toast } from 'sonner';

interface EditorState {
  // Project
  currentProject: Project | null;
  isLoading: boolean;
  isSaving: boolean;            // Currently saving (auto-save)
  error: string | null;

  // Workspace
  workspace: Blockly.WorkspaceSvg | null;  // Blockly workspace instance
  isDirty: boolean;              // Has unsaved changes
  workspaceXml: string | null;   // Blockly workspace serialized state
  isWorkspaceReady: boolean;     // Blockly fully initialized and restored

  // Code Generation
  generatedCode: string;         // Arduino C++ code output

  // UI State
  selectedCategory: string | null;  // Currently selected block category
  isCodePanelOpen: boolean;         // Code panel visibility
  selectedPort: string | null;      // Selected serial port

  // Drag State
  isDraggingBlock: boolean;        // Is a block currently being dragged
  draggedBlockId: string | null;   // ID of the block being dragged

  // Zoom
  zoomLevel: number;  // Workspace zoom percentage (default: 100)

  // Actions
  // Project Management
  loadProject: (id: string) => Promise<void>;
  saveProject: (isAutoSave?: boolean) => Promise<void>;
  closeProject: () => void;
  updateBoardType: (boardType: BoardType) => Promise<void>;
  refreshVariableFields: () => void;

  // Workspace
  setWorkspace: (workspace: Blockly.WorkspaceSvg | null) => void;
  setWorkspaceXml: (xml: string) => void;
  setWorkspaceReady: (ready: boolean) => void;
  markDirty: () => void;
  markClean: () => void;

  // Code
  setGeneratedCode: (code: string) => void;
  copyCodeToClipboard: () => Promise<void>;

  // UI
  selectCategory: (categoryId: string | null) => void;
  toggleCodePanel: () => void;
  setSelectedPort: (port: string | null) => Promise<void>;

  // Zoom & Controls
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  centerWorkspace: () => void;
  undo: () => void;
  redo: () => void;

  // Drag
  setDraggingBlock: (isDragging: boolean, blockId?: string | null) => void;

  // Reset
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  currentProject: null,
  isLoading: false,
  isSaving: false,
  error: null,

  workspace: null,
  isDirty: false,
  workspaceXml: null,
  isWorkspaceReady: false,

  generatedCode: '// Add blocks to generate Arduino code',

  selectedCategory: null,
  isCodePanelOpen: false,
  selectedPort: null,
  codePanelPosition: {
    x: typeof window !== 'undefined' ? window.innerWidth - 340 : 20,
    y: 20
  },

  isDraggingBlock: false,
  draggedBlockId: null,

  zoomLevel: EDITOR_CONFIG.ZOOM_DEFAULT,

  // Project Management
  loadProject: async (id: string) => {
    // Reset state first to prevent data from previous project bleeding in
    const currentProjectId = get().currentProject?.id;
    if (currentProjectId && currentProjectId !== id) {
      // Only reset if switching to a different project
      get().reset();
    }

    set({ isLoading: true, error: null, isWorkspaceReady: false });
    try {
      const project = await getProject(id);
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.boardType) {
        changeBoard(project.boardType);
      }

      set({
        currentProject: project,
        workspaceXml: project.workspace || null,
        selectedPort: project.selectedPort || null,
        isLoading: false,
        isDirty: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load project';
      set({
        error: message,
        isLoading: false,
      });
      toast.error('Failed to load project', {
        description: message
      });
    }
  },

  saveProject: async (isAutoSave: boolean = false) => {
    const { currentProject, workspaceXml, isDirty } = get();
    if (!currentProject) {
      console.warn('[editorStore] No current project to save');
      return;
    }

    // Skip auto-save if no changes
    if (isAutoSave && !isDirty) {
      return;
    }

    // Set saving state
    set({ isSaving: true, error: null });

    try {
      // Verify project still exists before saving
      const existingProject = await getProject(currentProject.id);
      if (!existingProject) {
        throw new Error('Project no longer exists');
      }

      await updateProject(currentProject.id, {
        workspace: workspaceXml || undefined,
      });

      set({ isDirty: false, isSaving: false });

      // No toast for auto-save, only for manual saves
      if (!isAutoSave) {
        toast.success('Project saved', {
          description: `"${currentProject.name}" has been saved successfully`,
          duration: 4000,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save project';
      set({
        error: message,
        isSaving: false,
      });

      // Only show error toast for manual saves
      if (!isAutoSave) {
        toast.error('Failed to save project', {
          description: message
        });
        throw error;
      } else {
        console.error('[editorStore] Auto-save failed:', message);
      }
    }
  },

  closeProject: () => {
    get().reset();
  },

  updateBoardType: async (boardType: BoardType) => {
    const { currentProject, workspace } = get();
    if (!currentProject) return;

    set({ isLoading: true, error: null });
    try {
      await updateProject(currentProject.id, { boardType });

      // Update the global board state so blocks use the new board's pins
      changeBoard(boardType);

      // Refresh all blocks in the workspace to update their pin dropdowns
      if (workspace) {
        const allBlocks = workspace.getAllBlocks(false);
        for (const block of allBlocks) {
          if (typeof (block as any).updateFields === 'function') {
            (block as any).updateFields(workspace);
          }
        }
      }

      set({
        currentProject: { ...currentProject, boardType },
        isLoading: false,
      });
      toast.success('Board updated', {
        description: 'Board type has been updated successfully'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update board type';
      set({
        error: message,
        isLoading: false,
      });
      toast.error('Failed to update board', {
        description: message
      });
      throw error;
    }
  },

  refreshVariableFields: () => {
    const { workspace } = get();
    if (!workspace) return;

    const allBlocks = workspace.getAllBlocks(false);
    for (const block of allBlocks) {
      if (typeof (block as any).updateFields === 'function') {
        (block as any).updateFields(workspace);
      }
    }
  },

  // Workspace
  setWorkspace: (workspace) => {
    set({ workspace });
  },

  setWorkspaceXml: (xml: string) => {
    set({ workspaceXml: xml });
  },

  setWorkspaceReady: (ready: boolean) => {
    set({ isWorkspaceReady: ready });
  },

  markDirty: () => {
    set({ isDirty: true });
  },

  markClean: () => {
    set({ isDirty: false });
  },

  // Code
  setGeneratedCode: (code: string) => {
    set({ generatedCode: code });
  },

  copyCodeToClipboard: async () => {
    const { generatedCode } = get();
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied', {
        description: 'Arduino code copied to clipboard'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to copy code';
      toast.error('Failed to copy code', {
        description: message
      });
      throw error;
    }
  },

  // UI
  selectCategory: (categoryId: string | null) => {
    set({ selectedCategory: categoryId });
  },

  toggleCodePanel: () => {
    set((state) => ({ isCodePanelOpen: !state.isCodePanelOpen }));
  },

  setSelectedPort: async (port: string | null) => {
    const { currentProject } = get();
    set({ selectedPort: port });

    // Save to project if one is loaded
    if (currentProject) {
      try {
        await updateProject(currentProject.id, { selectedPort: port || undefined });
        set({
          currentProject: { ...currentProject, selectedPort: port || undefined }
        });
      } catch (error) {
        console.error('[editorStore] Failed to save selected port:', error);
      }
    }

    if (port) {
      toast.success('Port selected', {
        description: `Connected to ${port}`,
        duration: 2000,
      });
    }
  },


  // Zoom & Controls
  zoomIn: () => {
    const { workspace } = get();
    if (workspace) {
      const flyout = workspace.getFlyout();
      if (flyout) flyout.hide();
      workspace.zoomCenter(1);
    }
    set((state) => ({
      zoomLevel: Math.min(state.zoomLevel + EDITOR_CONFIG.ZOOM_STEP, EDITOR_CONFIG.ZOOM_MAX),
    }));
  },

  zoomOut: () => {
    const { workspace } = get();
    if (workspace) {
      const flyout = workspace.getFlyout();
      if (flyout) flyout.hide();
      workspace.zoomCenter(-1);
    }
    set((state) => ({
      zoomLevel: Math.max(state.zoomLevel - EDITOR_CONFIG.ZOOM_STEP, EDITOR_CONFIG.ZOOM_MIN),
    }));
  },

  resetZoom: () => {
    const { workspace } = get();
    if (workspace) {
      const flyout = workspace.getFlyout();
      if (flyout) flyout.hide();
      workspace.setScale(1);
      workspace.scrollCenter();
    }
    set({ zoomLevel: EDITOR_CONFIG.ZOOM_DEFAULT });
  },

  centerWorkspace: () => {
    const { workspace } = get();
    if (workspace) {
      const blocks = workspace.getAllBlocks();
      const startBlock = blocks.find((block) => block.type === 'base_begin');
      if (startBlock) {
        workspace.centerOnBlock(startBlock.id);
      } else {
        workspace.zoomToFit();
      }
    }
  },

  undo: () => {
    const { workspace } = get();
    if (workspace) {
      workspace.undo(false);
    }
  },

  redo: () => {
    const { workspace } = get();
    if (workspace) {
      workspace.undo(true);
    }
  },

  // Drag
  setDraggingBlock: (isDragging: boolean, blockId?: string | null) => {
    set({
      isDraggingBlock: isDragging,
      draggedBlockId: blockId ?? null
    });
  },

  // Reset
  reset: () => {
    set({
      currentProject: null,
      isLoading: false,
      isSaving: false,
      error: null,
      workspace: null,
      isDirty: false,
      workspaceXml: null,
      isWorkspaceReady: false,
      generatedCode: '// Add blocks to generate Arduino code',
      selectedCategory: null,
      isCodePanelOpen: false,
      selectedPort: null,
      isDraggingBlock: false,
      draggedBlockId: null,
      zoomLevel: EDITOR_CONFIG.ZOOM_DEFAULT,
    });
  },
}));
