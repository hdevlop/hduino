'use client';

import * as Blockly from 'blockly';
import * as En from 'blockly/msg/en';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { useVariableDialogStore } from '@/stores/variableDialogStore';
import { initWorkspace, disposeWorkspace, clearWorkspace, showCategoryBlocks, } from '@/lib/blockly';
import { generateArduinoCode } from '@/lib/blockly/codeGenerator';
import { getWorkspaceXml, loadWorkspaceXml } from '@/lib/blockly/serialization';
import  '@/lib/blockly/init';

Blockly.setLocale(En as unknown as { [key: string]: string });


function setupCustomDialogs(): void {
  (Blockly.dialog as any).setPrompt((message: string, defaultValue: string, callback: (value: string | null) => void) => {
    const openDialog = useVariableDialogStore.getState().openDialog;
    const type = message.toLowerCase().includes('rename') ? 'rename' : 'create';
    openDialog(type, message, defaultValue, callback);
  });
}

const WORKSPACE_DIV_ID = 'hduino-workspace';

export function useBlockly() {
  const containerRef = useRef<HTMLElement | null>(null);
  const {
    workspace,
    setWorkspace,
    setWorkspaceXml,
    setGeneratedCode,
    markDirty,
    selectCategory,
    selectedCategory,
  } = useEditorStore();

  const handleBlockCollision = (block: Blockly.Block, workspaceDiv: HTMLElement) => {

  };

  useEffect(() => {
    const container = document.getElementById(WORKSPACE_DIV_ID);
    if (!container) {
      console.error(`[useBlockly] Element with id "${WORKSPACE_DIV_ID}" not found`);
      return;
    }

    containerRef.current = container;
    const savedWorkspaceXml = useEditorStore.getState().workspaceXml;
    let isInitializing = true;

    const ws = initWorkspace({
      container,
      onChange: () => {
        if (isInitializing) return;
        const currentWorkspace = useEditorStore.getState().workspace;
        if (currentWorkspace) {
          const xml = getWorkspaceXml(currentWorkspace);
          setWorkspaceXml(xml);
          const code = generateArduinoCode(currentWorkspace);
          setGeneratedCode(code);
          markDirty();
        }
      },
    });

    setupCustomDialogs();
    setWorkspace(ws);

    ws.addChangeListener((event: Blockly.Events.Abstract) => {
      if (event.type === Blockly.Events.VAR_CREATE) {
        const currentCategory = useEditorStore.getState().selectedCategory;
        if (currentCategory === 'variables') {
          showCategoryBlocks(ws, 'variables');
        }
        // Refresh blocks with variable-dependent fields
        useEditorStore.getState().refreshVariableFields();
      }

      if (event.type === Blockly.Events.VAR_DELETE) {
        const currentCategory = useEditorStore.getState().selectedCategory;
        if (currentCategory === 'variables') {
          showCategoryBlocks(ws, 'variables');
        }
        // Refresh blocks with variable-dependent fields
        useEditorStore.getState().refreshVariableFields();
      }

      if (event.type === Blockly.Events.VAR_RENAME) {
        const currentCategory = useEditorStore.getState().selectedCategory;
        if (currentCategory === 'variables') {
          showCategoryBlocks(ws, 'variables');
        }
        // Refresh blocks with variable-dependent fields
        useEditorStore.getState().refreshVariableFields();
      }

      if (event.type === 'click') {
        const clickEvent = event as Blockly.Events.Click;
        if (!clickEvent.blockId) {
          selectCategory(null);
        }
      }

      if (event.type === Blockly.Events.BLOCK_DRAG) {
        const dragEvent = event as Blockly.Events.BlockDrag;
        if (!dragEvent.isStart && dragEvent.blockId) {
          selectCategory(null);
          const block = ws.getBlockById(dragEvent.blockId);
          if (block) {
            handleBlockCollision(block, container);
          }
        }
      }

    });

    if (savedWorkspaceXml) {
      loadWorkspaceXml(ws, savedWorkspaceXml);
      // Refresh variable dropdowns after loading — variables are deserialized
      // before blocks, so VAR_CREATE listeners fire when no blocks exist yet.
      useEditorStore.getState().refreshVariableFields();
      ws.refreshToolboxSelection();
    } else {
      clearWorkspace(ws);
    }

    isInitializing = false;

    return () => {
      disposeWorkspace(ws);
      setWorkspace(null);
    };
  }, []);

  useEffect(() => {
    if (workspace) {
      showCategoryBlocks(workspace, selectedCategory);
    }
  }, [workspace, selectedCategory]);

  return {
    divId: WORKSPACE_DIV_ID,
  };
}
