/**
 * Block Types
 * Blockly block definitions, categories, and toolbox configuration
 */

// ============================================================
// Block Definition Types
// ============================================================

export interface BlockDefinition {
  type: string
  category: BlockCategory
  tooltip: string
  helpUrl?: string
  inputs?: BlockInput[]
  output?: BlockValueType | null // null = statement block
  previousStatement?: boolean
  nextStatement?: boolean
  colour: number | string
  extensions?: string[]
  mutator?: string
}

export type BlockValueType =
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Array'
  | 'Colour'
  | null // Any type

export interface BlockInput {
  type: 'value' | 'statement' | 'dummy'
  name: string
  check?: BlockValueType | BlockValueType[]
  align?: 'LEFT' | 'CENTRE' | 'RIGHT'
  fields?: BlockField[]
}

export type BlockField =
  | TextField
  | NumberField
  | DropdownField
  | CheckboxField
  | ColourField
  | AngleField
  | ImageField

interface BaseField {
  name: string
}

export interface TextField extends BaseField {
  type: 'field_input'
  text: string
  spellcheck?: boolean
}

export interface NumberField extends BaseField {
  type: 'field_number'
  value: number
  min?: number
  max?: number
  precision?: number
}

export interface DropdownField extends BaseField {
  type: 'field_dropdown'
  options: [string, string][] // [display, value]
}

export interface CheckboxField extends BaseField {
  type: 'field_checkbox'
  checked: boolean
}

export interface ColourField extends BaseField {
  type: 'field_colour'
  colour: string
}

export interface AngleField extends BaseField {
  type: 'field_angle'
  angle: number
}

export interface ImageField extends BaseField {
  type: 'field_image'
  src: string
  width: number
  height: number
  alt: string
}

// ============================================================
// Block Categories
// ============================================================

export type BlockCategory =
  | 'logic'
  | 'loops'
  | 'math'
  | 'text'
  | 'lists'
  | 'variables'
  | 'functions'
  // Arduino-specific
  | 'arduino_io'
  | 'arduino_time'
  | 'arduino_serial'
  | 'arduino_control'
  // Components
  | 'components_led'
  | 'components_button'
  | 'components_sensor'
  | 'components_motor'
  | 'components_display'
  | 'components_communication'

export interface CategoryDefinition {
  id: BlockCategory
  name: string
  colour: string
  icon?: string
  blocks: string[] // Block type names
}

export const CATEGORY_COLOURS: Record<BlockCategory, string> = {
  // Standard Blockly
  logic: '#5b80a5',
  loops: '#5ba55b',
  math: '#5b67a5',
  text: '#5ba58c',
  lists: '#745ba5',
  variables: '#a55b80',
  functions: '#995ba5',
  // Arduino
  arduino_io: '#00979D', // Arduino teal
  arduino_time: '#1E88E5',
  arduino_serial: '#7B1FA2',
  arduino_control: '#FF6F00',
  // Components
  components_led: '#F44336',
  components_button: '#4CAF50',
  components_sensor: '#2196F3',
  components_motor: '#FF9800',
  components_display: '#9C27B0',
  components_communication: '#00BCD4',
}

// ============================================================
// Toolbox Types
// ============================================================

export interface ToolboxDefinition {
  kind: 'categoryToolbox'
  contents: ToolboxItem[]
}

export type ToolboxItem = ToolboxCategory | ToolboxSeparator | ToolboxBlock

export interface ToolboxCategory {
  kind: 'category'
  name: string
  colour?: string
  categorystyle?: string
  contents: (ToolboxBlock | ToolboxLabel | ToolboxButton)[]
  custom?: 'VARIABLE' | 'PROCEDURE' // Built-in dynamic categories
}

export interface ToolboxSeparator {
  kind: 'sep'
  gap?: number
}

export interface ToolboxBlock {
  kind: 'block'
  type: string
  disabled?: boolean
  gap?: number
  fields?: Record<string, unknown>
  inputs?: Record<string, unknown>
}

export interface ToolboxLabel {
  kind: 'label'
  text: string
}

export interface ToolboxButton {
  kind: 'button'
  text: string
  callbackKey: string
}

// ============================================================
// Workspace Types
// ============================================================

export interface WorkspaceState {
  blocks: SerializedBlock[]
  variables: WorkspaceVariable[]
}

export interface SerializedBlock {
  type: string
  id: string
  x?: number
  y?: number
  collapsed?: boolean
  disabled?: boolean
  data?: string
  inputs?: Record<string, SerializedInput>
  fields?: Record<string, unknown>
  next?: SerializedBlock
}

export interface SerializedInput {
  block?: SerializedBlock
  shadow?: SerializedBlock
}

export interface WorkspaceVariable {
  name: string
  type: string
  id: string
}

// ============================================================
// Code Generator Types
// ============================================================

export type GeneratorLanguage = 'arduino'

export interface GeneratorOutput {
  code: string
  includes: string[]
  declarations: string[]
  setupCode: string[]
  loopCode: string[]
}

export interface BlockGenerator {
  (block: unknown, generator: unknown): string | [string, number] | null
}

// ============================================================
// Block Events
// ============================================================

export type BlockEventType =
  | 'block_create'
  | 'block_delete'
  | 'block_change'
  | 'block_move'
  | 'block_drag'
  | 'var_create'
  | 'var_delete'
  | 'var_rename'

export interface BlockEvent {
  type: BlockEventType
  workspaceId: string
  blockId?: string
  group?: string
  recordUndo: boolean
}