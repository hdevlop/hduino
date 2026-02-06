import * as Blockly from 'blockly';

/**
 * Get workspace as JSON string (uses modern Blockly serialization API)
 */
export function getWorkspaceXml(workspace: Blockly.WorkspaceSvg): string {
  const state = Blockly.serialization.workspaces.save(workspace);
  const jsonText = JSON.stringify(state);
  return jsonText;
}

/**
 * Load workspace from JSON string (uses modern Blockly serialization API)
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
}

/**
 * Get workspace as JSON string
 */
export function getWorkspaceJson(workspace: Blockly.WorkspaceSvg): string {
  return JSON.stringify(getWorkspaceXml(workspace));
}
