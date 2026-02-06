import * as Blockly from 'blockly/core';
import { getArduinoType, ArduinoType } from './types';

/**
 * Order of operation ENUMs for Arduino code generation
 */
export enum Order {
  ATOMIC = 0,            // 0 "" ...
  UNARY_POSTFIX = 1,     // expr++ expr-- () [] .
  UNARY_PREFIX = 2,      // -expr !expr ~expr ++expr --expr
  MULTIPLICATIVE = 3,    // * / % ~/
  ADDITIVE = 4,          // + -
  SHIFT = 5,             // << >>
  RELATIONAL = 6,        // is is! >= > <= <
  EQUALITY = 7,          // == != === !==
  BITWISE_AND = 8,       // &
  BITWISE_XOR = 9,       // ^
  BITWISE_OR = 10,       // |
  LOGICAL_AND = 11,      // &&
  LOGICAL_OR = 12,       // ||
  CONDITIONAL = 13,      // expr ? expr : expr
  ASSIGNMENT = 14,       // = *= /= ~/= %= += -= <<= >>= &= ^= |=
  COMMA = 15,            // ,
  UNARY_NEGATION = 16,
  MEMBER = 17,
  FUNCTION_CALL = 1,     // Mapping for function calls
  NONE = 99,             // (...)
}

/**
 * Pin type constants for Arduino pin management
 */
export const PinTypes = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  PWM: 'PWM',
  SERVO: 'SERVO',
  STEPPER: 'STEPPER',
  SERIAL: 'SERIAL',
  I2C: 'I2C/TWI',
  SPI: 'SPI',
} as const;

export type PinType = typeof PinTypes[keyof typeof PinTypes];

/**
 * Code sections storage interface
 */
interface CodeSections {
  includes_: Record<string, string>;
  definitions_: Record<string, string>;
  variables_: Record<string, string>;
  codeFunctions_: Record<string, string>;
  userFunctions_: Record<string, string>;
  functionNames_: Record<string, string>;
  setups_: Record<string, string>;
  loops_: Record<string, string>;
  pins_: Record<string, PinType>;
  loopCode_: Record<string, string>;
  nameDB_?: Blockly.Names;
}

/**
 * Arduino code generator class
 */
export class ArduinoGenerator extends Blockly.Generator {
  // Allow dynamic property assignment for block generators
  [key: string]: any;

  protected includes_: Record<string, string> = {};
  protected definitions_: Record<string, string> = {};
  variables_: Record<string, string> = {};
  protected codeFunctions_: Record<string, string> = {};
  protected userFunctions_: Record<string, string> = {};
  protected functionNames_: Record<string, string> = {};
  protected setups_: Record<string, string> = {};
  protected loops_: Record<string, string> = {};
  protected pins_: Record<string, { pinType: PinType; blockId: string; blockLabel: string }> = {};
  protected loopCode_: Record<string, string> = {};
  declare nameDB_?: Blockly.Names;

  // Infinite loop trap for loop detection
  INFINITE_LOOP_TRAP: string | null = null;

  // Order constants
  ORDER_ATOMIC = Order.ATOMIC;
  ORDER_UNARY_POSTFIX = Order.UNARY_POSTFIX;
  ORDER_UNARY_PREFIX = Order.UNARY_PREFIX;
  ORDER_MULTIPLICATIVE = Order.MULTIPLICATIVE;
  ORDER_ADDITIVE = Order.ADDITIVE;
  ORDER_SHIFT = Order.SHIFT;
  ORDER_RELATIONAL = Order.RELATIONAL;
  ORDER_EQUALITY = Order.EQUALITY;
  ORDER_BITWISE_AND = Order.BITWISE_AND;
  ORDER_BITWISE_XOR = Order.BITWISE_XOR;
  ORDER_BITWISE_OR = Order.BITWISE_OR;
  ORDER_LOGICAL_AND = Order.LOGICAL_AND;
  ORDER_LOGICAL_OR = Order.LOGICAL_OR;
  ORDER_CONDITIONAL = Order.CONDITIONAL;
  ORDER_ASSIGNMENT = Order.ASSIGNMENT;
  ORDER_COMMA = Order.COMMA;
  ORDER_UNARY_NEGATION = Order.UNARY_NEGATION;
  ORDER_MEMBER = Order.MEMBER;
  ORDER_FUNCTION_CALL = Order.FUNCTION_CALL;
  ORDER_NONE = Order.NONE;

  DEF_FUNC_NAME: string;

  constructor() {
    super('Arduino');

    this.DEF_FUNC_NAME = this.FUNCTION_NAME_PLACEHOLDER_;

    // Add reserved words
    this.addReservedWords(
      'Blockly,' +
      'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
      'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
      'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
      'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
      'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
      'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
      'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
      'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
      'detachInterrupt,interrupts,noInterrupts'
    );
  }

  /**
   * Initialize the code generator for a workspace
   */
  init(workspace: Blockly.Workspace): void {
    this.includes_ = Object.create(null);
    this.definitions_ = Object.create(null);
    this.variables_ = Object.create(null);
    this.codeFunctions_ = Object.create(null);
    this.userFunctions_ = Object.create(null);
    this.functionNames_ = Object.create(null);
    this.setups_ = Object.create(null);
    this.loops_ = Object.create(null);
    this.pins_ = Object.create(null);
    this.loopCode_ = Object.create(null);

    if (!this.nameDB_) {
      this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
    } else {
      this.nameDB_.reset();
    }

    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);

    // Initialize variables
    const defvars: string[] = [];
    const variables = Blockly.Variables.allDeveloperVariables(workspace);
    for (let x = 0; x < variables.length; x++) {
      defvars[x] = `int ${this.nameDB_.getName(variables[x], Blockly.Names.NameType.VARIABLE)};\n`;
    }
    this.definitions_['variables'] = defvars.join('\n');
  }

  /**
   * Finalize code generation and assemble final Arduino sketch
   */
  finish(code: string): string {
    const includes: string[] = [];
    const definitions: string[] = [];
    const variables: string[] = [];
    const functions: string[] = [];
    const loopCode: string[] = [];

    // Collect loop code
    for (const name in this.loopCode_) {
      loopCode.push(this.loopCode_[name]);
    }

    // Collect includes
    for (const name in this.includes_) {
      includes.push(this.includes_[name]);
    }
    if (includes.length) {
      includes.push('\n');
      // Remove duplicates
      const uniqueIncludes = [...new Set(includes)];
      includes.length = 0;
      includes.push(...uniqueIncludes);
    }

    // Collect variables
    for (const name in this.variables_) {
      variables.push(this.variables_[name]);
    }
    if (variables.length) {
      variables.push('\n');
    }

    // Collect definitions
    for (const name in this.definitions_) {
      definitions.push(this.definitions_[name]);
    }
    if (definitions.length) {
      definitions.push('\n');
    }

    // Collect functions
    for (const name in this.codeFunctions_) {
      functions.push(this.codeFunctions_[name]);
    }
    for (const name in this.userFunctions_) {
      functions.push(this.userFunctions_[name]);
    }
    if (functions.length) {
      functions.push('\n');
    }

    // Collect setup code
    const setups: string[] = [''];
    let userSetupCode = '';
    if (this.setups_['userSetupCode'] !== undefined) {
      userSetupCode = this.setups_['userSetupCode'];
      delete this.setups_['userSetupCode'];
    }
    for (const name in this.setups_) {
      setups.push(this.setups_[name]);
    }
    if (userSetupCode) {
      setups.push(userSetupCode);
    }
    const filteredSetups = setups.filter((e) => e);

    // Collect loop code
    let loops = '';
    if (this.loops_['userLoopCode'] !== undefined) {
      loops = '\n' + this.loops_['userLoopCode'];
      delete this.loops_['userLoopCode'];
    }

    // Clean up temporary data
    this.nameDB_?.reset();

    // Assemble final code
    const allDefs = includes.join('\n') + definitions.join('\n') + variables.join('\n') + functions.join('\n');
    const setup = 'void setup() {\n' + filteredSetups.join('\n') + '\n}\n\n';
    const loop = 'void loop() {\n  ' + loopCode.join('\n  ') + loops.replace(/\n/g, '\n  ') + '\n}\n\n';

    return allDefs + setup + loop;
  }

  /**
   * Add an include statement
   */
  addInclude(includeTag: string, code: string): void {
    if (this.includes_[includeTag] === undefined) {
      this.includes_[includeTag] = code;
    }
  }

  /**
   * Add a global declaration
   */
  addDeclaration(declarationTag: string, code: string): void {
    if (this.definitions_[declarationTag] === undefined) {
      this.definitions_[declarationTag] = code;
    }
  }

  /**
   * Add a global variable
   */
  addVariable(varName: string, code: string, overwrite = false): boolean {
    let overwritten = false;
    if (overwrite || this.variables_[varName] === undefined) {
      this.variables_[varName] = code;
      overwritten = true;
    }
    return overwritten;
  }

  /**
   * Add code to setup() function
   */
  addSetup(setupTag: string, code: string, overwrite = false): boolean {
    let overwritten = false;
    if (overwrite || this.setups_[setupTag] === undefined) {
      this.setups_[setupTag] = code;
      overwritten = true;
    }
    return overwritten;
  }

  /**
   * Add code to loop() function
   */
  addLoop(loopTag: string, code: string, overwrite = false): boolean {
    let overwritten = false;
    if (overwrite || this.loops_[loopTag] === undefined) {
      this.loops_[loopTag] = code;
      overwritten = true;
    }
    return overwritten;
  }

  /**
   * Add a function definition
   */
  addFunction(preferredName: string, code: string): string {
    if (this.codeFunctions_[preferredName] === undefined) {
      const uniqueName = this.nameDB_!.getDistinctName(
        preferredName,
        Blockly.Names.NameType.PROCEDURE
      );
      this.codeFunctions_[preferredName] = code.replace(this.DEF_FUNC_NAME, uniqueName);
      this.functionNames_[preferredName] = uniqueName;
    }
    return this.functionNames_[preferredName];
  }

  /**
   * Reserve a pin for a specific use and check for conflicts
   */
  reservePin(block: Blockly.Block, pin: string, pinType: PinType, warningTag: string): void {
    if (this.pins_[pin] !== undefined) {
      const existing = this.pins_[pin];
      if (existing.blockId !== block.id) {
        block.setWarningText(
          `Pin ${pin} is already used by "${existing.blockLabel}"`,
          warningTag
        );
      } else {
        block.setWarningText(null, warningTag);
      }
    } else {
      this.pins_[pin] = { pinType, blockId: block.id, blockLabel: block.type };
      block.setWarningText(null, warningTag);
    }
  }

  /**
   * Naked values have their tab removed and end with a semicolon
   */
  scrubNakedValue(line: string): string {
    return line + ';\n';
  }

  /**
   * Encode a string for Arduino
   */
  quote_(string: string): string {
    string = string
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\\n')
      .replace(/\$/g, '\\$')
      .replace(/'/g, "\\'");
    return '"' + string + '"';
  }

  /**
   * Common scrubbing for blocks
   */
  scrub_(block: Blockly.Block, code: string): string {
    if (code === null) {
      return '';
    }

    let commentCode = '';
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      const comment = block.getCommentText();
      if (comment) {
        commentCode += this.prefixLines(comment, '// ') + '\n';
      }

      for (let x = 0; x < block.inputList.length; x++) {
        // Modern Blockly: Check if input has a connection of type INPUT_VALUE
        const input = block.inputList[x];
        if (input.connection && input.connection.type === Blockly.ConnectionType.INPUT_VALUE) {
          const childBlock = input.connection.targetBlock();
          if (childBlock) {
            const childComment = this.allNestedComments(childBlock);
            if (childComment) {
              commentCode += this.prefixLines(childComment, '// ');
            }
          }
        }
      }
    }

    const nextBlock = block.nextConnection?.targetBlock();
    const nextCode = this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  }

  /**
   * Add code to execute every loop iteration (before main loop body)
   */
  addLoopCode(tag: string, code: string): void {
    this.loopCode_[tag] = code;
  }

  /**
   * Add loop trap code if INFINITE_LOOP_TRAP is set
   */
  addLoopTrap(branch: string, block: Blockly.Block): string {
    if (this.INFINITE_LOOP_TRAP) {
      return this.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
    }
    return branch;
  }

  /**
   * Convert Arduino type to C++ type string
   */
  getArduinoType_(type: ArduinoType): string {
    return getArduinoType(type);
  }

  /**
   * Helper functions for no generator code
   */
  noGeneratorCodeInline(): [string, number] {
    return ['', this.ORDER_ATOMIC];
  }

  noGeneratorCodeLine(): string {
    return '';
  }
}

// Create singleton instance
export const arduinoGenerator = new ArduinoGenerator();
