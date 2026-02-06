import type * as Blockly from 'blockly';
import { arduinoGenerator } from '@hduino/arduino';

/**
 * Generate Arduino code from a Blockly workspace
 */
export function generateArduinoCode(workspace: Blockly.WorkspaceSvg): string {
  return arduinoGenerator.workspaceToCode(workspace);
}
