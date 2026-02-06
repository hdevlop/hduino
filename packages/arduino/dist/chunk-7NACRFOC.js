// src/arduino/types.ts
import * as Blockly from "blockly/core";
var ArduinoType = class {
  constructor(config) {
    this.typeId = config.typeId;
    this.typeMsgName = config.typeMsgName;
    this.compatibleTypes = config.compatibleTypes || [];
  }
  get typeName() {
    return this.typeMsgName;
  }
  addCompatibleTypes(types) {
    this.compatibleTypes.push(...types);
  }
};
var Types = {
  /** Const integer number */
  CONST_NUMBER: new ArduinoType({
    typeId: "Const Number",
    typeMsgName: "NUMBER"
  }),
  /** Character */
  CHARACTER: new ArduinoType({
    typeId: "Character",
    typeMsgName: "CHAR"
  }),
  /** Text string */
  TEXT: new ArduinoType({
    typeId: "Text",
    typeMsgName: "TEXT"
  }),
  /** Boolean */
  BOOLEAN: new ArduinoType({
    typeId: "Boolean",
    typeMsgName: "BOOL"
  }),
  /** Short integer number */
  SHORT_NUMBER: new ArduinoType({
    typeId: "Short Number",
    typeMsgName: "SHORT"
  }),
  /** Integer number */
  NUMBER: new ArduinoType({
    typeId: "Number",
    typeMsgName: "NUMBER"
  }),
  /** Unsigned integer number */
  UNS_NUMBER: new ArduinoType({
    typeId: "Unsigned number",
    typeMsgName: "UNS_NUMBER"
  }),
  /** Volatile integer number */
  VOLATIL_NUMBER: new ArduinoType({
    typeId: "Volatil Number",
    typeMsgName: "VOLATILE"
  }),
  /** Large integer number */
  LARGE_NUMBER: new ArduinoType({
    typeId: "Large Number",
    typeMsgName: "LONG"
  }),
  /** Large unsigned integer number */
  LARGE_UNS_NUMBER: new ArduinoType({
    typeId: "Unsigned Large Number",
    typeMsgName: "UNS_LONG"
  }),
  /** Decimal/floating point number */
  DECIMAL: new ArduinoType({
    typeId: "Decimal",
    typeMsgName: "DECIMAL"
  }),
  /** Array/List of items */
  ARRAY: new ArduinoType({
    typeId: "Array",
    typeMsgName: "ARRAY"
  }),
  /** Null indicates there is no type */
  NULL: new ArduinoType({
    typeId: "Null",
    typeMsgName: "NULL"
  }),
  /** Type not defined, or not yet defined */
  UNDEF: new ArduinoType({
    typeId: "Undefined",
    typeMsgName: "UNDEF"
  }),
  /** Set when no child block (meant to define the variable type) is connected */
  CHILD_BLOCK_MISSING: new ArduinoType({
    typeId: "ChildBlockMissing",
    typeMsgName: "CHILDBLOCKMISSING"
  })
};
Types.TEXT.addCompatibleTypes([Types.CHARACTER]);
Types.UNS_NUMBER.addCompatibleTypes([Types.SHORT_NUMBER, Types.NUMBER]);
Types.LARGE_UNS_NUMBER.addCompatibleTypes([
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER
]);
Types.NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL
]);
Types.CONST_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL
]);
Types.UNS_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.DECIMAL
]);
Types.SHORT_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.NUMBER,
  Types.DECIMAL
]);
Types.LARGE_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER,
  Types.DECIMAL
]);
Types.LARGE_UNS_NUMBER.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER,
  Types.DECIMAL
]);
Types.VOLATIL_NUMBER.addCompatibleTypes([
  Types.SHORT_NUMBER,
  Types.LARGE_NUMBER,
  Types.UNS_NUMBER,
  Types.NUMBER
]);
Types.DECIMAL.addCompatibleTypes([
  Types.BOOLEAN,
  Types.SHORT_NUMBER,
  Types.NUMBER,
  Types.LARGE_NUMBER
]);
function getArduinoType(typeBlockly) {
  switch (typeBlockly.typeId) {
    case Types.CONST_NUMBER.typeId:
      return "const int";
    case Types.SHORT_NUMBER.typeId:
      return "char";
    case Types.NUMBER.typeId:
      return "int";
    case Types.UNS_NUMBER.typeId:
      return "unsigned int";
    case Types.LARGE_NUMBER.typeId:
      return "long";
    case Types.LARGE_UNS_NUMBER.typeId:
      return "unsigned long";
    case Types.DECIMAL.typeId:
      return "float";
    case Types.TEXT.typeId:
      return "String";
    case Types.VOLATIL_NUMBER.typeId:
      return "volatile";
    case Types.CHARACTER.typeId:
      return "char";
    case Types.BOOLEAN.typeId:
      return "boolean";
    case Types.NULL.typeId:
      return "void";
    case Types.UNDEF.typeId:
      return "undefined";
    case Types.CHILD_BLOCK_MISSING.typeId:
      return "int";
    default:
      return "Invalid Blockly Type";
  }
}
function getValidTypeArray() {
  const typesArray = [];
  const excludedTypes = ["UNDEF", "CHILD_BLOCK_MISSING", "NULL", "ARRAY"];
  for (const [key, value] of Object.entries(Types)) {
    if (!excludedTypes.includes(key) && value instanceof ArduinoType) {
      typesArray.push([value.typeName, key]);
    }
  }
  return typesArray;
}
var regExpInt = /^-?\d+$/;
var regExpFloat = /^-?[0-9]*[.][0-9]+$/;
function identifyNumber(numberString) {
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
function getChildBlockType(block) {
  let blockType;
  let nextBlock = block;
  while (nextBlock && !nextBlock.getBlockType && nextBlock.inputList.length > 0 && nextBlock.inputList[0].connection != null) {
    nextBlock = nextBlock.inputList[0].connection.targetBlock();
  }
  if (nextBlock === block) {
    blockType = Types.CHILD_BLOCK_MISSING;
  } else if (nextBlock === null) {
    blockType = Types.CHILD_BLOCK_MISSING;
  } else {
    const func = nextBlock.getBlockType;
    if (func) {
      blockType = func.call(nextBlock);
    } else {
      blockType = Types.NULL;
    }
  }
  return blockType;
}
var StaticTyping = class _StaticTyping {
  constructor() {
    this.varTypeDict = {};
    this.pendingVarTypeDict = {};
  }
  /**
   * Collect all variables with their types from workspace
   */
  collectVarsWithTypes(workspace) {
    this.varTypeDict = /* @__PURE__ */ Object.create(null);
    this.pendingVarTypeDict = /* @__PURE__ */ Object.create(null);
    const blocks = _StaticTyping.getAllStatementsOrdered(workspace);
    for (let i = 0; i < blocks.length; i++) {
      const blockVarAndTypes = _StaticTyping.getBlockVars(blocks[i]);
      for (let j = 0; j < blockVarAndTypes.length; j++) {
        let variableName = blockVarAndTypes[j][0];
        let variableType = blockVarAndTypes[j][1];
        if (Array.isArray(variableType)) {
          if (variableType[1].endsWith("_AGI")) {
            const varAGI = variableType[1].substring(0, variableType[1].lastIndexOf("_"));
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
  static getAllStatementsOrdered(workspace) {
    const getAllContinuousStatements = (startBlock) => {
      let block = startBlock;
      const blocks = [];
      do {
        blocks.push(block);
        const blockNextConnection = block.nextConnection;
        const connections = block.getConnections_();
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
    const allStatementBlocks = [];
    const topBlocks = workspace.getTopBlocks(true);
    for (let i = 0; i < topBlocks.length; i++) {
      allStatementBlocks.push(...getAllContinuousStatements(topBlocks[i]));
    }
    return allStatementBlocks;
  }
  /**
   * Get variables and their types from a block
   */
  static getBlockVars(block) {
    const blockVarAndTypes = [];
    const getVars = block.getVars;
    if (getVars) {
      const blockVariables = getVars.call(block);
      for (let i = 0; i < blockVariables.length; i++) {
        const varName = blockVariables[i];
        const getVarType = block.getVarType;
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
  assignTypeToVars(block, varName, varType) {
    const currentType = this.varTypeDict[varName];
    if (currentType === void 0 || currentType === Types.UNDEF) {
      this.varTypeDict[varName] = varType;
      if (varType !== Types.UNDEF && this.pendingVarTypeDict[varName] !== void 0) {
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
  setBlockTypeWarning(block, blockType, varName) {
    const warningLabel = "varType";
    if (blockType === Types.CHILD_BLOCK_MISSING || this.varTypeDict[varName] === Types.CHILD_BLOCK_MISSING) {
      block.setWarningText(null, warningLabel);
    } else {
      block.setWarningText(null, warningLabel);
    }
  }
  /**
   * Set procedure argument types
   */
  setProcedureArgs(workspace) {
    const blocks = workspace.getTopBlocks();
    for (let i = 0; i < blocks.length; i++) {
      const setArgsType = blocks[i].setArgsType;
      if (setArgsType) {
        setArgsType.call(blocks[i], this.varTypeDict);
      }
    }
  }
};

// src/arduino/boards.ts
function generateDigitalIo(pinStart, pinEnd) {
  const digitalIo = [];
  for (let i = pinStart; i <= pinEnd; i++) {
    digitalIo.push([i.toString(), i.toString()]);
  }
  return digitalIo;
}
function generateAnalogIo(pinStart, pinEnd) {
  const analogIo = [];
  for (let i = pinStart; i <= pinEnd; i++) {
    analogIo.push([`A${i}`, `A${i}`]);
  }
  return analogIo;
}
function duplicateBoardProfile(originalBoard, name, description, compilerFlag) {
  return {
    ...originalBoard,
    name,
    description: description || originalBoard.description,
    compilerFlag: compilerFlag || originalBoard.compilerFlag
  };
}
var SERIAL_SPEEDS = [
  ["300", "300"],
  ["600", "600"],
  ["1200", "1200"],
  ["2400", "2400"],
  ["4800", "4800"],
  ["9600", "9600"],
  ["14400", "14400"],
  ["19200", "19200"],
  ["28800", "28800"],
  ["31250", "31250"],
  ["38400", "38400"],
  ["57600", "57600"],
  ["115200", "115200"]
];
var SPI_CLOCK_DIVIDES = [
  ["2 (8MHz)", "SPI_CLOCK_DIV2"],
  ["4 (4MHz)", "SPI_CLOCK_DIV4"],
  ["8 (2MHz)", "SPI_CLOCK_DIV8"],
  ["16 (1MHz)", "SPI_CLOCK_DIV16"],
  ["32 (500KHz)", "SPI_CLOCK_DIV32"],
  ["64 (250KHz)", "SPI_CLOCK_DIV64"],
  ["128 (125KHz)", "SPI_CLOCK_DIV128"]
];
var UNO = {
  name: "Arduino Uno",
  description: "Arduino Uno standard compatible board",
  compilerFlag: "arduino:avr:uno",
  image: "/boards/uno.png",
  analogPins: generateAnalogIo(0, 5),
  digitalPins: [...generateDigitalIo(0, 13), ...generateAnalogIo(0, 5)],
  pwmPins: [
    ["3", "3"],
    ["5", "5"],
    ["6", "6"],
    ["9", "9"],
    ["10", "10"],
    ["11", "11"]
  ],
  serial: [["serial", "Serial"]],
  serialPins: { Serial: [["RX", "0"], ["TX", "1"]] },
  serialSpeed: SERIAL_SPEEDS,
  spi: [["SPI", "SPI"]],
  spiPins: { SPI: [["MOSI", "11"], ["MISO", "12"], ["SCK", "13"]] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [["I2C", "Wire"]],
  i2cPins: { Wire: [["SDA", "A4"], ["SCL", "A5"]] },
  i2cSpeed: [["100kHz", "100000L"], ["400kHz", "400000L"]],
  builtinLed: [["BUILTIN_1", "13"]],
  interrupt: [["interrupt0", "2"], ["interrupt1", "3"]],
  bootloader: "uno"
};
var NANO = {
  name: "Arduino Nano",
  description: "Arduino Nano with ATmega328p board",
  compilerFlag: "arduino:avr:nano",
  image: "/boards/nano.png",
  analogPins: generateAnalogIo(0, 7),
  digitalPins: [...generateDigitalIo(0, 13), ...generateAnalogIo(0, 7)],
  pwmPins: UNO.pwmPins,
  serial: UNO.serial,
  serialPins: UNO.serialPins,
  serialSpeed: UNO.serialSpeed,
  spi: UNO.spi,
  spiPins: UNO.spiPins,
  spiClockDivide: UNO.spiClockDivide,
  i2c: UNO.i2c,
  i2cPins: UNO.i2cPins,
  i2cSpeed: UNO.i2cSpeed,
  builtinLed: UNO.builtinLed,
  interrupt: UNO.interrupt,
  bootloader: "nano"
};
var MEGA = {
  name: "Arduino Mega",
  description: "Arduino Mega-compatible board",
  compilerFlag: "arduino:avr:mega:cpu=atmega2560",
  image: "/boards/mega.png",
  analogPins: generateAnalogIo(0, 15),
  digitalPins: [...generateDigitalIo(0, 53), ...generateAnalogIo(0, 15)],
  pwmPins: [...generateDigitalIo(2, 13), ...generateDigitalIo(44, 46)],
  serial: [
    ["serial", "Serial"],
    ["serial_1", "Serial1"],
    ["serial_2", "Serial2"],
    ["serial_3", "Serial3"]
  ],
  serialPins: {
    Serial: [["TX", "0"], ["RX", "1"]],
    Serial1: [["TX", "18"], ["RX", "19"]],
    Serial2: [["TX", "16"], ["RX", "17"]],
    Serial3: [["TX", "14"], ["RX", "15"]]
  },
  serialSpeed: SERIAL_SPEEDS,
  spi: [["SPI", "SPI"]],
  spiPins: { SPI: [["MOSI", "51"], ["MISO", "50"], ["SCK", "52"]] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [["I2C", "Wire"]],
  i2cPins: { Wire: [["SDA", "20"], ["SCL", "21"]] },
  i2cSpeed: [["100kHz", "100000L"], ["400kHz", "400000L"]],
  builtinLed: UNO.builtinLed,
  interrupt: [
    ["interrupt0", "2"],
    ["interrupt1", "3"],
    ["interrupt2", "21"],
    ["interrupt3", "20"],
    ["interrupt4", "19"],
    ["interrupt5", "18"]
  ],
  bootloader: "mega"
};
var PRO_MINI = {
  name: "Arduino Pro Mini",
  description: "Arduino Pro Mini with ATmega328p board",
  compilerFlag: "arduino:avr:pro:cpu=16MHzatmega328",
  image: "/boards/pro.png",
  analogPins: generateAnalogIo(0, 7),
  digitalPins: [...generateDigitalIo(0, 13), ...generateAnalogIo(0, 7)],
  pwmPins: UNO.pwmPins,
  serial: UNO.serial,
  serialPins: UNO.serialPins,
  serialSpeed: UNO.serialSpeed,
  spi: UNO.spi,
  spiPins: UNO.spiPins,
  spiClockDivide: UNO.spiClockDivide,
  i2c: UNO.i2c,
  i2cPins: UNO.i2cPins,
  i2cSpeed: UNO.i2cSpeed,
  builtinLed: UNO.builtinLed,
  interrupt: UNO.interrupt,
  bootloader: "pro"
};
var ESP32 = {
  name: "ESP32",
  description: "ESP32 development board",
  compilerFlag: "esp32:esp32:esp32",
  image: "/boards/esp32.png",
  analogPins: [
    ...generateAnalogIo(0, 19),
    ["A32", "32"],
    ["A33", "33"],
    ["A34", "34"],
    ["A35", "35"],
    ["A36", "36"],
    ["A39", "39"]
  ],
  digitalPins: [
    ...generateDigitalIo(0, 5),
    ...generateDigitalIo(12, 19),
    ...generateDigitalIo(21, 23),
    ...generateDigitalIo(25, 27),
    ...generateDigitalIo(32, 33)
  ],
  pwmPins: generateDigitalIo(0, 33),
  serial: [
    ["serial", "Serial"],
    ["serial_1", "Serial1"],
    ["serial_2", "Serial2"]
  ],
  serialPins: {
    Serial: [["TX", "1"], ["RX", "3"]],
    Serial1: [["TX", "10"], ["RX", "9"]],
    Serial2: [["TX", "17"], ["RX", "16"]]
  },
  serialSpeed: SERIAL_SPEEDS,
  spi: [["SPI", "SPI"], ["HSPI", "HSPI"], ["VSPI", "VSPI"]],
  spiPins: {
    SPI: [["MOSI", "23"], ["MISO", "19"], ["SCK", "18"]],
    HSPI: [["MOSI", "13"], ["MISO", "12"], ["SCK", "14"]],
    VSPI: [["MOSI", "23"], ["MISO", "19"], ["SCK", "18"]]
  },
  i2c: [["I2C", "Wire"]],
  i2cPins: { Wire: [["SDA", "21"], ["SCL", "22"]] },
  i2cSpeed: [["100kHz", "100000L"], ["400kHz", "400000L"]],
  builtinLed: [["BUILTIN_1", "2"]],
  interrupt: generateDigitalIo(0, 39)
};
var ESP8266 = {
  name: "ESP8266",
  description: "ESP8266 development board",
  compilerFlag: "esp8266:esp8266:generic",
  image: "/boards/esp8266.png",
  analogPins: [["A0", "A0"]],
  digitalPins: [
    ["D0", "D0"],
    ["D1", "D1"],
    ["D2", "D2"],
    ["D3", "D3"],
    ["D4", "D4"],
    ["D5", "D5"],
    ["D6", "D6"],
    ["D7", "D7"],
    ["D8", "D8"]
  ],
  pwmPins: [
    ["D1", "D1"],
    ["D2", "D2"],
    ["D3", "D3"],
    ["D4", "D4"],
    ["D5", "D5"],
    ["D6", "D6"],
    ["D7", "D7"],
    ["D8", "D8"]
  ],
  serial: [["serial", "Serial"]],
  serialPins: { Serial: [["RX", "RX"], ["TX", "TX"]] },
  serialSpeed: SERIAL_SPEEDS,
  spi: [["SPI", "SPI"]],
  spiPins: { SPI: [["MOSI", "D7"], ["MISO", "D6"], ["SCK", "D5"]] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [["I2C", "Wire"]],
  i2cPins: { Wire: [["SDA", "D2"], ["SCL", "D1"]] },
  i2cSpeed: UNO.i2cSpeed,
  builtinLed: [["BUILTIN_1", "D4"]],
  interrupt: [
    ["D0", "D0"],
    ["D1", "D1"],
    ["D2", "D2"],
    ["D3", "D3"],
    ["D4", "D4"],
    ["D5", "D5"],
    ["D6", "D6"],
    ["D7", "D7"],
    ["D8", "D8"]
  ]
};
var BOARD_KEYS = [
  "arduino_uno",
  "arduino_nano",
  "arduino_mega",
  "arduino_pro_mini",
  "esp32",
  "esp8266"
];
var BOARD_PROFILES = {
  arduino_uno: UNO,
  arduino_nano: NANO,
  arduino_mega: MEGA,
  arduino_pro_mini: PRO_MINI,
  esp32: ESP32,
  esp8266: ESP8266
};
var selectedBoard = BOARD_PROFILES.arduino_uno;
function changeBoard(boardKey) {
  if (boardKey in BOARD_PROFILES) {
    selectedBoard = BOARD_PROFILES[boardKey];
    return selectedBoard;
  }
  console.warn(`Tried to set non-existing Arduino board: ${boardKey}`);
  return null;
}
function getSelectedBoard() {
  return selectedBoard;
}
function getAllPins() {
  return selectedBoard.digitalPins;
}
function getAllPinsAnalog() {
  return selectedBoard.analogPins;
}
var Arduino = {
  get AllPins() {
    return getAllPins();
  },
  get AllPinsAnalog() {
    return getAllPinsAnalog();
  },
  get analogPins() {
    return getAllPinsAnalog();
  },
  get PwmPins() {
    return selectedBoard.pwmPins;
  },
  get BuiltinLed() {
    return selectedBoard.builtinLed;
  },
  get onlyVar() {
    return [["", ""]];
  },
  Boards: {
    get selected() {
      return selectedBoard;
    },
    /**
     * Refresh a block's field dropdown with updated board pin data or variables
     */
    refreshBlockFieldDropdown(block, fieldName, pinType, workspace) {
      const field = block.getField(fieldName);
      if (!field) return;
      let pins;
      switch (pinType) {
        case "AllPins":
          pins = getAllPins();
          break;
        case "AllPinsAnalog":
        case "analogPins":
          pins = getAllPinsAnalog();
          break;
        case "digitalPins":
          pins = selectedBoard.digitalPins;
          break;
        case "pwmPins":
          pins = selectedBoard.pwmPins;
          break;
        case "builtinLed":
          pins = selectedBoard.builtinLed;
          break;
        case "onlyVar":
          if (!workspace) {
            pins = [["", ""]];
            break;
          }
          const variables = workspace.getVariableMap().getVariablesOfType("");
          if (variables.length === 0) {
            pins = [["", ""]];
          } else {
            pins = variables.map((v) => [v.getName(), v.getName()]);
          }
          break;
        default:
          pins = [];
      }
      if (pins.length > 0 && field.menuGenerator_) {
        field.menuGenerator_ = pins;
      }
    }
  }
};

export {
  ArduinoType,
  Types,
  getArduinoType,
  getValidTypeArray,
  identifyNumber,
  getChildBlockType,
  StaticTyping,
  generateDigitalIo,
  generateAnalogIo,
  duplicateBoardProfile,
  UNO,
  NANO,
  MEGA,
  PRO_MINI,
  ESP32,
  ESP8266,
  BOARD_KEYS,
  BOARD_PROFILES,
  selectedBoard,
  changeBoard,
  getSelectedBoard,
  getAllPins,
  getAllPinsAnalog,
  Arduino
};
//# sourceMappingURL=chunk-7NACRFOC.js.map