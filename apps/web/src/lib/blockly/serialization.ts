import * as Blockly from 'blockly';

/**
 * Clean up unused variables from workspace
 * Removes variables that are not referenced by any blocks
 */
export function cleanupUnusedVariables(workspace: Blockly.WorkspaceSvg): void {
  const allVariables = workspace.getAllVariables();
  const usedVariableIds = new Set<string>();

  // Collect all variable IDs used by blocks
  const allBlocks = workspace.getAllBlocks(false);
  allBlocks.forEach((block) => {
    // Method 1: Get all variable fields via getVarModels()
    const varFields = block.getVarModels();
    if (varFields) {
      varFields.forEach((varModel) => {
        if (varModel) {
          usedVariableIds.add(varModel.getId());
        }
      });
    }

    // Method 2: Check all fields for FieldVariable instances (including FieldVariableCreateOnly)
    const inputList = block.inputList;
    inputList.forEach((input) => {
      input.fieldRow.forEach((field) => {
        if (field instanceof Blockly.FieldVariable) {
          const varModel = field.getVariable();
          if (varModel) {
            usedVariableIds.add(varModel.getId());
          }
        }
      });
    });
  });

  // Delete unused variables (in reverse to avoid index issues)
  const unusedVariables = allVariables.filter((v) => !usedVariableIds.has(v.getId()));
  unusedVariables.forEach((variable) => {
    try {
      workspace.deleteVariableById(variable.getId());
    } catch (e) {
      // Silently ignore errors (variable might be in use by shadow blocks, etc.)
      console.debug('Could not delete variable:', variable.getId(), e);
    }
  });
}

/**
 * Get workspace as JSON string (uses modern Blockly serialization API)
 * @param workspace - The workspace to serialize
 * @param cleanup - Whether to clean up unused variables (default: false)
 */
export function getWorkspaceXml(workspace: Blockly.WorkspaceSvg, cleanup: boolean = false): string {
  // Only clean up unused variables if explicitly requested (e.g., on project export)
  if (cleanup) {
    cleanupUnusedVariables(workspace);
  }

  const state = Blockly.serialization.workspaces.save(workspace);
  const jsonText = JSON.stringify(state);
  return jsonText;
}

/**
 * Load workspace from JSON string (uses modern Blockly serialization API)
 * Cleans up unused variables after loading
 */
export function loadWorkspaceXml(workspace: Blockly.WorkspaceSvg, data: string): void {
  try {
    const state = JSON.parse(data);
    workspace.clear();
    Blockly.serialization.workspaces.load(state, workspace);
  } catch (e) {
    const dom = Blockly.utils.xml.textToDom(data);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
  }

  // Clean up unused variables after loading (handles old projects with unused vars)
  cleanupUnusedVariables(workspace);
}

/**
 * Get workspace as JSON string
 */
export function getWorkspaceJson(workspace: Blockly.WorkspaceSvg): string {
  return JSON.stringify(getWorkspaceXml(workspace));
}
