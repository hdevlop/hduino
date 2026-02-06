import {
  getArduinoType
} from "./chunk-7NACRFOC.js";

// src/arduino/generator.ts
import * as Blockly from "blockly/core";
var Order = /* @__PURE__ */ ((Order2) => {
  Order2[Order2["ATOMIC"] = 0] = "ATOMIC";
  Order2[Order2["UNARY_POSTFIX"] = 1] = "UNARY_POSTFIX";
  Order2[Order2["UNARY_PREFIX"] = 2] = "UNARY_PREFIX";
  Order2[Order2["MULTIPLICATIVE"] = 3] = "MULTIPLICATIVE";
  Order2[Order2["ADDITIVE"] = 4] = "ADDITIVE";
  Order2[Order2["SHIFT"] = 5] = "SHIFT";
  Order2[Order2["RELATIONAL"] = 6] = "RELATIONAL";
  Order2[Order2["EQUALITY"] = 7] = "EQUALITY";
  Order2[Order2["BITWISE_AND"] = 8] = "BITWISE_AND";
  Order2[Order2["BITWISE_XOR"] = 9] = "BITWISE_XOR";
  Order2[Order2["BITWISE_OR"] = 10] = "BITWISE_OR";
  Order2[Order2["LOGICAL_AND"] = 11] = "LOGICAL_AND";
  Order2[Order2["LOGICAL_OR"] = 12] = "LOGICAL_OR";
  Order2[Order2["CONDITIONAL"] = 13] = "CONDITIONAL";
  Order2[Order2["ASSIGNMENT"] = 14] = "ASSIGNMENT";
  Order2[Order2["COMMA"] = 15] = "COMMA";
  Order2[Order2["UNARY_NEGATION"] = 16] = "UNARY_NEGATION";
  Order2[Order2["MEMBER"] = 17] = "MEMBER";
  Order2[Order2["FUNCTION_CALL"] = 1] = "FUNCTION_CALL";
  Order2[Order2["NONE"] = 99] = "NONE";
  return Order2;
})(Order || {});
var PinTypes = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT",
  PWM: "PWM",
  SERVO: "SERVO",
  STEPPER: "STEPPER",
  SERIAL: "SERIAL",
  I2C: "I2C/TWI",
  SPI: "SPI"
};
var ArduinoGenerator = class extends Blockly.Generator {
  constructor() {
    super("Arduino");
    this.includes_ = {};
    this.definitions_ = {};
    this.variables_ = {};
    this.codeFunctions_ = {};
    this.userFunctions_ = {};
    this.functionNames_ = {};
    this.setups_ = {};
    this.loops_ = {};
    this.pins_ = {};
    this.loopCode_ = {};
    // Infinite loop trap for loop detection
    this.INFINITE_LOOP_TRAP = null;
    // Order constants
    this.ORDER_ATOMIC = 0 /* ATOMIC */;
    this.ORDER_UNARY_POSTFIX = 1 /* UNARY_POSTFIX */;
    this.ORDER_UNARY_PREFIX = 2 /* UNARY_PREFIX */;
    this.ORDER_MULTIPLICATIVE = 3 /* MULTIPLICATIVE */;
    this.ORDER_ADDITIVE = 4 /* ADDITIVE */;
    this.ORDER_SHIFT = 5 /* SHIFT */;
    this.ORDER_RELATIONAL = 6 /* RELATIONAL */;
    this.ORDER_EQUALITY = 7 /* EQUALITY */;
    this.ORDER_BITWISE_AND = 8 /* BITWISE_AND */;
    this.ORDER_BITWISE_XOR = 9 /* BITWISE_XOR */;
    this.ORDER_BITWISE_OR = 10 /* BITWISE_OR */;
    this.ORDER_LOGICAL_AND = 11 /* LOGICAL_AND */;
    this.ORDER_LOGICAL_OR = 12 /* LOGICAL_OR */;
    this.ORDER_CONDITIONAL = 13 /* CONDITIONAL */;
    this.ORDER_ASSIGNMENT = 14 /* ASSIGNMENT */;
    this.ORDER_COMMA = 15 /* COMMA */;
    this.ORDER_UNARY_NEGATION = 16 /* UNARY_NEGATION */;
    this.ORDER_MEMBER = 17 /* MEMBER */;
    this.ORDER_FUNCTION_CALL = 1 /* FUNCTION_CALL */;
    this.ORDER_NONE = 99 /* NONE */;
    this.DEF_FUNC_NAME = this.FUNCTION_NAME_PLACEHOLDER_;
    this.addReservedWords(
      "Blockly,setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,float,double,string,String,array,static,volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts"
    );
  }
  /**
   * Initialize the code generator for a workspace
   */
  init(workspace) {
    this.includes_ = /* @__PURE__ */ Object.create(null);
    this.definitions_ = /* @__PURE__ */ Object.create(null);
    this.variables_ = /* @__PURE__ */ Object.create(null);
    this.codeFunctions_ = /* @__PURE__ */ Object.create(null);
    this.userFunctions_ = /* @__PURE__ */ Object.create(null);
    this.functionNames_ = /* @__PURE__ */ Object.create(null);
    this.setups_ = /* @__PURE__ */ Object.create(null);
    this.loops_ = /* @__PURE__ */ Object.create(null);
    this.pins_ = /* @__PURE__ */ Object.create(null);
    this.loopCode_ = /* @__PURE__ */ Object.create(null);
    if (!this.nameDB_) {
      this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
    } else {
      this.nameDB_.reset();
    }
    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);
    const defvars = [];
    const variables = Blockly.Variables.allDeveloperVariables(workspace);
    for (let x = 0; x < variables.length; x++) {
      defvars[x] = `int ${this.nameDB_.getName(variables[x], Blockly.Names.NameType.VARIABLE)};
`;
    }
    this.definitions_["variables"] = defvars.join("\n");
  }
  /**
   * Finalize code generation and assemble final Arduino sketch
   */
  finish(code) {
    const includes = [];
    const definitions = [];
    const variables = [];
    const functions = [];
    const loopCode = [];
    for (const name in this.loopCode_) {
      loopCode.push(this.loopCode_[name]);
    }
    for (const name in this.includes_) {
      includes.push(this.includes_[name]);
    }
    if (includes.length) {
      includes.push("\n");
      const uniqueIncludes = [...new Set(includes)];
      includes.length = 0;
      includes.push(...uniqueIncludes);
    }
    for (const name in this.variables_) {
      variables.push(this.variables_[name]);
    }
    if (variables.length) {
      variables.push("\n");
    }
    for (const name in this.definitions_) {
      definitions.push(this.definitions_[name]);
    }
    if (definitions.length) {
      definitions.push("\n");
    }
    for (const name in this.codeFunctions_) {
      functions.push(this.codeFunctions_[name]);
    }
    for (const name in this.userFunctions_) {
      functions.push(this.userFunctions_[name]);
    }
    if (functions.length) {
      functions.push("\n");
    }
    const setups = [""];
    let userSetupCode = "";
    if (this.setups_["userSetupCode"] !== void 0) {
      userSetupCode = this.setups_["userSetupCode"];
      delete this.setups_["userSetupCode"];
    }
    for (const name in this.setups_) {
      setups.push(this.setups_[name]);
    }
    if (userSetupCode) {
      setups.push(userSetupCode);
    }
    const filteredSetups = setups.filter((e) => e);
    let loops = "";
    if (this.loops_["userLoopCode"] !== void 0) {
      loops = "\n" + this.loops_["userLoopCode"];
      delete this.loops_["userLoopCode"];
    }
    this.nameDB_?.reset();
    const allDefs = includes.join("\n") + definitions.join("\n") + variables.join("\n") + functions.join("\n");
    const setup = "void setup() {\n" + filteredSetups.join("\n") + "\n}\n\n";
    const loop = "void loop() {\n  " + loopCode.join("\n  ") + loops.replace(/\n/g, "\n  ") + "\n}\n\n";
    return allDefs + setup + loop;
  }
  /**
   * Add an include statement
   */
  addInclude(includeTag, code) {
    if (this.includes_[includeTag] === void 0) {
      this.includes_[includeTag] = code;
    }
  }
  /**
   * Add a global declaration
   */
  addDeclaration(declarationTag, code) {
    if (this.definitions_[declarationTag] === void 0) {
      this.definitions_[declarationTag] = code;
    }
  }
  /**
   * Add a global variable
   */
  addVariable(varName, code, overwrite = false) {
    let overwritten = false;
    if (overwrite || this.variables_[varName] === void 0) {
      this.variables_[varName] = code;
      overwritten = true;
    }
    return overwritten;
  }
  /**
   * Add code to setup() function
   */
  addSetup(setupTag, code, overwrite = false) {
    let overwritten = false;
    if (overwrite || this.setups_[setupTag] === void 0) {
      this.setups_[setupTag] = code;
      overwritten = true;
    }
    return overwritten;
  }
  /**
   * Add code to loop() function
   */
  addLoop(loopTag, code, overwrite = false) {
    let overwritten = false;
    if (overwrite || this.loops_[loopTag] === void 0) {
      this.loops_[loopTag] = code;
      overwritten = true;
    }
    return overwritten;
  }
  /**
   * Add a function definition
   */
  addFunction(preferredName, code) {
    if (this.codeFunctions_[preferredName] === void 0) {
      const uniqueName = this.nameDB_.getDistinctName(
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
  reservePin(block, pin, pinType, warningTag) {
    if (this.pins_[pin] !== void 0) {
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
  scrubNakedValue(line) {
    return line + ";\n";
  }
  /**
   * Encode a string for Arduino
   */
  quote_(string) {
    string = string.replace(/\\/g, "\\\\").replace(/\n/g, "\\\n").replace(/\$/g, "\\$").replace(/'/g, "\\'");
    return '"' + string + '"';
  }
  /**
   * Common scrubbing for blocks
   */
  scrub_(block, code) {
    if (code === null) {
      return "";
    }
    let commentCode = "";
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      const comment = block.getCommentText();
      if (comment) {
        commentCode += this.prefixLines(comment, "// ") + "\n";
      }
      for (let x = 0; x < block.inputList.length; x++) {
        const input = block.inputList[x];
        if (input.connection && input.connection.type === Blockly.ConnectionType.INPUT_VALUE) {
          const childBlock = input.connection.targetBlock();
          if (childBlock) {
            const childComment = this.allNestedComments(childBlock);
            if (childComment) {
              commentCode += this.prefixLines(childComment, "// ");
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
  addLoopCode(tag, code) {
    this.loopCode_[tag] = code;
  }
  /**
   * Add loop trap code if INFINITE_LOOP_TRAP is set
   */
  addLoopTrap(branch, block) {
    if (this.INFINITE_LOOP_TRAP) {
      return this.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
    }
    return branch;
  }
  /**
   * Convert Arduino type to C++ type string
   */
  getArduinoType_(type) {
    return getArduinoType(type);
  }
  /**
   * Helper functions for no generator code
   */
  noGeneratorCodeInline() {
    return ["", this.ORDER_ATOMIC];
  }
  noGeneratorCodeLine() {
    return "";
  }
};
var arduinoGenerator = new ArduinoGenerator();

export {
  Order,
  PinTypes,
  ArduinoGenerator,
  arduinoGenerator
};
//# sourceMappingURL=chunk-VKL5354C.js.map