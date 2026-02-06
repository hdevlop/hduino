/**
 * Types Module
 * Re-exports all type definitions
 */

// Arduino types (boards, pins, compiler, upload)
export type {
  BoardType,
  PinMode,
  DigitalValue,
  PinState,
  CompilerOptions,
  CompileResult,
  CompileError,
  CompileWarning,
  CompiledOutput,
  UploadStatus,
  SerialPort,
  UploadOptions,
  UploadResult,
  BaudRate,
  SerialMessage,
} from './arduino'

export {
  DEFAULT_BOARD,
  BAUD_RATES,
  DEFAULT_BAUD_RATE,
} from './arduino'

// Block types (Blockly definitions, categories, toolbox)
export type {
  BlockDefinition,
  BlockValueType,
  BlockInput,
  BlockField,
  TextField,
  NumberField,
  DropdownField,
  CheckboxField,
  ColourField,
  AngleField,
  ImageField,
  BlockCategory,
  CategoryDefinition,
  ToolboxDefinition,
  ToolboxItem,
  ToolboxCategory,
  ToolboxSeparator,
  ToolboxBlock,
  ToolboxLabel,
  ToolboxButton,
  WorkspaceState,
  SerializedBlock,
  SerializedInput,
  WorkspaceVariable,
  GeneratorLanguage,
  GeneratorOutput,
  BlockGenerator,
  BlockEventType,
  BlockEvent,
} from './block'

export { CATEGORY_COLOURS } from './block'

// Project types
export type {
  Project,
  ProjectRecord,
  HduinoExportFile,
  ProjectSortField,
  SortDirection,
  ProjectSortOptions,
  ProjectFilters,
} from './project'

export {
  HDUINO_FILE_EXTENSION,
  HDUINO_FILE_VERSION,
} from './project'