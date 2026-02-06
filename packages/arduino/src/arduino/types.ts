import * as Blockly from 'blockly/core';

/**
 * Type class for Arduino type system
 */
export class ArduinoType {
  typeId: string;
  typeMsgName: string;
  compatibleTypes: ArduinoType[];

  constructor(config: { typeId: string; typeMsgName: string; compatibleTypes?: ArduinoType[] }) {
    this.typeId = config.typeId;
    this.typeMsgName = config.typeMsgName;
    this.compatibleTypes = config.compatibleTypes || [];
  }

  get typeName(): string {
    return this.typeMsgName;
  }

  addCompatibleTypes(types: ArduinoType[]): void {
    this.compatibleTypes.push(...types);
  }
}

/**
 * Arduino type definitions
 */
export const Types = {
  /** Const integer number */
  CONST_NUMBER: new ArduinoType({
    typeId: 'Const Number',
    typeMsgName: 'NUMBER',
  }),

  /** Character */
  CHARACTER: new ArduinoType({
    typeId: 'Character',
    typeMsgName: 'CHAR',
  }),

  /** Text string */
  TEXT: new ArduinoType({
    typeId: 'Text',
    typeMsgName: 'TEXT',
  }),

  /** Boolean */
  BOOLEAN: new ArduinoType({
    typeId: 'Boolean',
    typeMsgName: 'BOOL',
  }),

  /** Short integer number */
  SHORT_NUMBER: new ArduinoType({
    typeId: 'Short Number',
    typeMsgName: 'SHORT',
  }),

  /** Integer number */
  NUMBER: new ArduinoType({
    typeId: 'Number',
    typeMsgName: 'NUMBER',
  }),

  /** Unsigned integer number */
  UNS_NUMBER: new ArduinoType({
    typeId: 'Unsigned number',
    typeMsgName: 'UNS_NUMBER',
  }),

  /** Volatile integer number */
  VOLATIL_NUMBER: new ArduinoType({
    typeId: 'Volatil Number',
    typeMsgName: 'VOLATILE',
  }),

  /** Large integer number */
  LARGE_NUMBER: new ArduinoType({
    typeId: 'Large Number',
    typeMsgName: 'LONG',
  }),

  /** Large unsigned integer number */
  LARGE_UNS_NUMBER: new ArduinoType({
    typeId: 'Unsigned Large Number',
    typeMsgName: 'UNS_LONG',
  }),

  /** Decimal/floating point number */
  DECIMAL: new ArduinoType({
    typeId: 'Decimal',
    typeMsgName: 'DECIMAL',
  }),

  /** Array/List of items */
  ARRAY: new ArduinoType({
    typeId: 'Array',
    typeMsgName: 'ARRAY',
  }),

  /** Null indicates there is no type */
  NULL: new ArduinoType({
    typeId: 'Null',
    typeMsgName: 'NULL',
  }),

  /** Type not defined, or not yet defined */
  UNDEF: new ArduinoType({
    typeId: 'Undefined',
    typeMsgName: 'UNDEF',
  }),

  /** Set when no child block (meant to define the variable type) is connected */
  CHILD_BLOCK_MISSING: new ArduinoType({
    typeId: 'ChildBlockMissing',
    typeMsgName: 'CHILDBLOCKMISSING',
  }),
};

// Setup circular dependencies after all types are defined
Types.TEXT.addCompatibleTypes([Types.CHARACTER]);

Types.UNS_NUMBER.addCompatibleTypes([Types.SHORT_NUMBER, Types.NUMBER]);

Types.LARGE_UNS_NUMBER.addCompatibleTypes([
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER,
]);

Types.NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL,
]);

Types.CONST_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL,
]);

Types.UNS_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.DECIMAL,
]);

Types.SHORT_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.NUMBER,
  Types.DECIMAL,
]);

Types.LARGE_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER,
  Types.DECIMAL,
]);

Types.LARGE_UNS_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL,
]);

Types.VOLATIL_NUMBER.addCompatibleTypes([
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER,
]);

Types.DECIMAL.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER,
]);

/**
 * Convert Arduino type to C++ type string
 */
export function getArduinoType(typeBlockly: ArduinoType): string {
  switch (typeBlockly.typeId) {
    case Types.CONST_NUMBER.typeId:
      return 'const int';
    case Types.SHORT_NUMBER.typeId:
      return 'char';
    case Types.NUMBER.typeId:
      return 'int';
    case Types.UNS_NUMBER.typeId:
      return 'unsigned int';
    case Types.LARGE_NUMBER.typeId:
      return 'long';
    case Types.LARGE_UNS_NUMBER.typeId:
      return 'unsigned long';
    case Types.DECIMAL.typeId:
      return 'float';
    case Types.TEXT.typeId:
      return 'String';
    case Types.VOLATIL_NUMBER.typeId:
      return 'volatile';
    case Types.CHARACTER.typeId:
      return 'char';
    case Types.BOOLEAN.typeId:
      return 'boolean';
    case Types.NULL.typeId:
      return 'void';
    case Types.UNDEF.typeId:
      return 'undefined';
    case Types.CHILD_BLOCK_MISSING.typeId:
      return 'int';
    default:
      return 'Invalid Blockly Type';
  }
}

/**
 * Get valid type array for dropdowns
 */
export function getValidTypeArray(): [string, string][] {
  const typesArray: [string, string][] = [];
  const excludedTypes = ['UNDEF', 'CHILD_BLOCK_MISSING', 'NULL', 'ARRAY'];

  for (const [key, value] of Object.entries(Types)) {
    if (!excludedTypes.includes(key) && value instanceof ArduinoType) {
      typesArray.push([value.typeName, key]);
    }
  }

  return typesArray;
}

/**
 * Regular expression to identify an integer
 */
const regExpInt = /^-?\d+$/;

/**
 * Regular expression to identify a decimal
 */
const regExpFloat = /^-?[0-9]*[.][0-9]+$/;

/**
 * Identify if a number string is an integer or floating point
 */
export function identifyNumber(numberString: string): ArduinoType {
  if (regExpInt.test(numberString)) {
    const intValue = parseInt(numberString);
    if (isNaN(intValue)) {
      return Types.NULL;
    }
    if (intValue > 32767 || intValue < -32768) {
      return Types.LARGE_NUMBER;
    }
    return Types.NUMBER;
  } else if (regExpFloat.test(numberString)) {
    return Types.DECIMAL;
  }
  return Types.NULL;
}

/**
 * Navigate through child blocks to get the block type
 */
export function getChildBlockType(block: Blockly.Block): ArduinoType {
  let blockType: ArduinoType;
  let nextBlock: Blockly.Block | null = block;

  // Only checks first input block, so it decides the type
  while (
    nextBlock &&
    !(nextBlock as any).getBlockType &&
    nextBlock.inputList.length > 0 &&
    nextBlock.inputList[0].connection != null
  ) {
    nextBlock = nextBlock.inputList[0].connection.targetBlock();
  }

  if (nextBlock === block) {
    // Set variable block is empty, so no type yet
    blockType = Types.CHILD_BLOCK_MISSING;
  } else if (nextBlock === null) {
    // Null return from targetBlock indicates no block connected
    blockType = Types.CHILD_BLOCK_MISSING;
  } else {
    const func = (nextBlock as any).getBlockType;
    if (func) {
      blockType = func.call(nextBlock);
    } else {
      // Most inner block, supposed to define a type, is missing getBlockType()
      blockType = Types.NULL;
    }
  }

  return blockType;
}

/**
 * Static typing class for collecting and managing variable types
 */
export class StaticTyping {
  private varTypeDict: Record<string, any> = {};
  private pendingVarTypeDict: Record<string, string[]> = {};

  /**
   * Collect all variables with their types from workspace
   */
  collectVarsWithTypes(workspace: Blockly.Workspace): Record<string, any> {
    this.varTypeDict = Object.create(null);
    this.pendingVarTypeDict = Object.create(null);

    const blocks = StaticTyping.getAllStatementsOrdered(workspace);

    for (let i = 0; i < blocks.length; i++) {
      const blockVarAndTypes = StaticTyping.getBlockVars(blocks[i]);

      for (let j = 0; j < blockVarAndTypes.length; j++) {
        let variableName = blockVarAndTypes[j][0];
        let variableType = blockVarAndTypes[j][1];

        // Handle indirect type definitions
        if (Array.isArray(variableType)) {
          if (variableType[1].endsWith('_AGI')) {
            const varAGI = variableType[1].substring(0, variableType[1].lastIndexOf('_'));
            variableType = this.varTypeDict[varAGI] || Types.UNDEF;

            if (variableType?.arrayType) {
              if (Array.isArray(variableType.arrayType) && variableType.arrayType.length === 2) {
                variableType = this.varTypeDict[variableType.arrayType[1]];
              } else {
                variableType = variableType.arrayType;
              }
            }
          } else {
            if (this.varTypeDict[variableType[1]]) {
              variableType = this.varTypeDict[variableType[1]];
            } else {
              // Add to pending list
              if (!Array.isArray(this.pendingVarTypeDict[variableType[1]])) {
                this.pendingVarTypeDict[variableType[1]] = [variableName];
              } else {
                this.pendingVarTypeDict[variableType[1]].push(variableName);
              }
              variableType = Types.UNDEF;
            }
          }
        }

        this.assignTypeToVars(blocks[i], variableName, variableType);
      }
    }

    return this.varTypeDict;
  }

  /**
   * Get all statement blocks ordered from workspace
   */
  static getAllStatementsOrdered(workspace: Blockly.Workspace): Blockly.Block[] {
    const getAllContinuousStatements = (startBlock: Blockly.Block): Blockly.Block[] => {
      let block: Blockly.Block | null = startBlock;
      const blocks: Blockly.Block[] = [];

      do {
        blocks.push(block);
        const blockNextConnection = block.nextConnection;
        const connections = (block as any).getConnections_();
        block = null;

        for (let j = 0; j < connections.length; j++) {
          if (connections[j].type === Blockly.NEXT_STATEMENT) {
            const nextBlock = connections[j].targetBlock();
            if (nextBlock) {
              if (connections[j] === blockNextConnection) {
                block = nextBlock;
              } else {
                blocks.push(...getAllContinuousStatements(nextBlock));
              }
            }
          }
        }
      } while (block);

      return blocks;
    };

    const allStatementBlocks: Blockly.Block[] = [];
    const topBlocks = workspace.getTopBlocks(true);

    for (let i = 0; i < topBlocks.length; i++) {
      allStatementBlocks.push(...getAllContinuousStatements(topBlocks[i]));
    }

    return allStatementBlocks;
  }

  /**
   * Get variables and their types from a block
   */
  static getBlockVars(block: Blockly.Block): [string, any][] {
    const blockVarAndTypes: [string, any][] = [];
    const getVars = (block as any).getVars;

    if (getVars) {
      const blockVariables = getVars.call(block);

      for (let i = 0; i < blockVariables.length; i++) {
        const varName = blockVariables[i];
        const getVarType = (block as any).getVarType;

        if (getVarType) {
          const varType = getVarType.call(block, varName);
          blockVarAndTypes.push([varName, varType]);
        } else {
          blockVarAndTypes.push([varName, Types.NULL]);
        }
      }
    }

    return blockVarAndTypes;
  }

  /**
   * Assign type to variable in the type dictionary
   */
  private assignTypeToVars(block: Blockly.Block, varName: string, varType: any): void {
    const currentType = this.varTypeDict[varName];

    if (currentType === undefined || currentType === Types.UNDEF) {
      this.varTypeDict[varName] = varType;

      if (varType !== Types.UNDEF && this.pendingVarTypeDict[varName] !== undefined) {
        for (let i = 0; i < this.pendingVarTypeDict[varName].length; i++) {
          this.assignTypeToVars(block, this.pendingVarTypeDict[varName][i], varType);
        }
      }
    } else {
      this.setBlockTypeWarning(block, varType, varName);
    }
  }

  /**
   * Set warning on block for type mismatch
   */
  private setBlockTypeWarning(block: Blockly.Block, blockType: any, varName: string): void {
    const warningLabel = 'varType';

    if (
      blockType === Types.CHILD_BLOCK_MISSING ||
      this.varTypeDict[varName] === Types.CHILD_BLOCK_MISSING
    ) {
      block.setWarningText(null, warningLabel);
    } else {
      block.setWarningText(null, warningLabel);
    }
  }

  /**
   * Set procedure argument types
   */
  setProcedureArgs(workspace: Blockly.Workspace): void {
    const blocks = workspace.getTopBlocks();

    for (let i = 0; i < blocks.length; i++) {
      const setArgsType = (blocks[i] as any).setArgsType;
      if (setArgsType) {
        setArgsType.call(blocks[i], this.varTypeDict);
      }
    }
  }
}
