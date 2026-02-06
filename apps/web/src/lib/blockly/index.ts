// Re-export workspace utilities (local - UI specific)
export {
  initWorkspace,
  disposeWorkspace,
  clearWorkspace,
  getAllBlocks,
  getStartBlock,
  deleteAllBlocks,
  getEmptyWorkspaceXml,
  type WorkspaceOptions,
} from './workspace';

// Re-export code generation (local - uses package)
export { generateArduinoCode } from './codeGenerator';

// Re-export serialization utilities (local - UI specific)
export { getWorkspaceXml, loadWorkspaceXml, getWorkspaceJson } from './serialization';

// Re-export from @hduino/arduino package
export * from '@hduino/arduino';
