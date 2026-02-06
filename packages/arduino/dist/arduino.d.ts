import * as Blockly from 'blockly/core';

/**
 * Type class for Arduino type system
 */
declare class ArduinoType {
    typeId: string;
    typeMsgName: string;
    compatibleTypes: ArduinoType[];
    constructor(config: {
        typeId: string;
        typeMsgName: string;
        compatibleTypes?: ArduinoType[];
    });
    get typeName(): string;
    addCompatibleTypes(types: ArduinoType[]): void;
}
/**
 * Arduino type definitions
 */
declare const Types: {
    /** Const integer number */
    CONST_NUMBER: ArduinoType;
    /** Character */
    CHARACTER: ArduinoType;
    /** Text string */
    TEXT: ArduinoType;
    /** Boolean */
    BOOLEAN: ArduinoType;
    /** Short integer number */
    SHORT_NUMBER: ArduinoType;
    /** Integer number */
    NUMBER: ArduinoType;
    /** Unsigned integer number */
    UNS_NUMBER: ArduinoType;
    /** Volatile integer number */
    VOLATIL_NUMBER: ArduinoType;
    /** Large integer number */
    LARGE_NUMBER: ArduinoType;
    /** Large unsigned integer number */
    LARGE_UNS_NUMBER: ArduinoType;
    /** Decimal/floating point number */
    DECIMAL: ArduinoType;
    /** Array/List of items */
    ARRAY: ArduinoType;
    /** Null indicates there is no type */
    NULL: ArduinoType;
    /** Type not defined, or not yet defined */
    UNDEF: ArduinoType;
    /** Set when no child block (meant to define the variable type) is connected */
    CHILD_BLOCK_MISSING: ArduinoType;
};
/**
 * Convert Arduino type to C++ type string
 */
declare function getArduinoType(typeBlockly: ArduinoType): string;
/**
 * Get valid type array for dropdowns
 */
declare function getValidTypeArray(): [string, string][];
/**
 * Identify if a number string is an integer or floating point
 */
declare function identifyNumber(numberString: string): ArduinoType;
/**
 * Navigate through child blocks to get the block type
 */
declare function getChildBlockType(block: Blockly.Block): ArduinoType;
/**
 * Static typing class for collecting and managing variable types
 */
declare class StaticTyping {
    private varTypeDict;
    private pendingVarTypeDict;
    /**
     * Collect all variables with their types from workspace
     */
    collectVarsWithTypes(workspace: Blockly.Workspace): Record<string, any>;
    /**
     * Get all statement blocks ordered from workspace
     */
    static getAllStatementsOrdered(workspace: Blockly.Workspace): Blockly.Block[];
    /**
     * Get variables and their types from a block
     */
    static getBlockVars(block: Blockly.Block): [string, any][];
    /**
     * Assign type to variable in the type dictionary
     */
    private assignTypeToVars;
    /**
     * Set warning on block for type mismatch
     */
    private setBlockTypeWarning;
    /**
     * Set procedure argument types
     */
    setProcedureArgs(workspace: Blockly.Workspace): void;
}

/**
 * Order of operation ENUMs for Arduino code generation
 */
declare enum Order {
    ATOMIC = 0,// 0 "" ...
    UNARY_POSTFIX = 1,// expr++ expr-- () [] .
    UNARY_PREFIX = 2,// -expr !expr ~expr ++expr --expr
    MULTIPLICATIVE = 3,// * / % ~/
    ADDITIVE = 4,// + -
    SHIFT = 5,// << >>
    RELATIONAL = 6,// is is! >= > <= <
    EQUALITY = 7,// == != === !==
    BITWISE_AND = 8,// &
    BITWISE_XOR = 9,// ^
    BITWISE_OR = 10,// |
    LOGICAL_AND = 11,// &&
    LOGICAL_OR = 12,// ||
    CONDITIONAL = 13,// expr ? expr : expr
    ASSIGNMENT = 14,// = *= /= ~/= %= += -= <<= >>= &= ^= |=
    COMMA = 15,// ,
    UNARY_NEGATION = 16,
    MEMBER = 17,
    FUNCTION_CALL = 1,// Mapping for function calls
    NONE = 99
}
/**
 * Pin type constants for Arduino pin management
 */
declare const PinTypes: {
    readonly INPUT: "INPUT";
    readonly OUTPUT: "OUTPUT";
    readonly PWM: "PWM";
    readonly SERVO: "SERVO";
    readonly STEPPER: "STEPPER";
    readonly SERIAL: "SERIAL";
    readonly I2C: "I2C/TWI";
    readonly SPI: "SPI";
};
type PinType = typeof PinTypes[keyof typeof PinTypes];
/**
 * Arduino code generator class
 */
declare class ArduinoGenerator extends Blockly.Generator {
    [key: string]: any;
    protected includes_: Record<string, string>;
    protected definitions_: Record<string, string>;
    variables_: Record<string, string>;
    protected codeFunctions_: Record<string, string>;
    protected userFunctions_: Record<string, string>;
    protected functionNames_: Record<string, string>;
    protected setups_: Record<string, string>;
    protected loops_: Record<string, string>;
    protected pins_: Record<string, {
        pinType: PinType;
        blockId: string;
        blockLabel: string;
    }>;
    protected loopCode_: Record<string, string>;
    nameDB_?: Blockly.Names;
    INFINITE_LOOP_TRAP: string | null;
    ORDER_ATOMIC: Order;
    ORDER_UNARY_POSTFIX: Order;
    ORDER_UNARY_PREFIX: Order;
    ORDER_MULTIPLICATIVE: Order;
    ORDER_ADDITIVE: Order;
    ORDER_SHIFT: Order;
    ORDER_RELATIONAL: Order;
    ORDER_EQUALITY: Order;
    ORDER_BITWISE_AND: Order;
    ORDER_BITWISE_XOR: Order;
    ORDER_BITWISE_OR: Order;
    ORDER_LOGICAL_AND: Order;
    ORDER_LOGICAL_OR: Order;
    ORDER_CONDITIONAL: Order;
    ORDER_ASSIGNMENT: Order;
    ORDER_COMMA: Order;
    ORDER_UNARY_NEGATION: Order;
    ORDER_MEMBER: Order;
    ORDER_FUNCTION_CALL: Order;
    ORDER_NONE: Order;
    DEF_FUNC_NAME: string;
    constructor();
    /**
     * Initialize the code generator for a workspace
     */
    init(workspace: Blockly.Workspace): void;
    /**
     * Finalize code generation and assemble final Arduino sketch
     */
    finish(code: string): string;
    /**
     * Add an include statement
     */
    addInclude(includeTag: string, code: string): void;
    /**
     * Add a global declaration
     */
    addDeclaration(declarationTag: string, code: string): void;
    /**
     * Add a global variable
     */
    addVariable(varName: string, code: string, overwrite?: boolean): boolean;
    /**
     * Add code to setup() function
     */
    addSetup(setupTag: string, code: string, overwrite?: boolean): boolean;
    /**
     * Add code to loop() function
     */
    addLoop(loopTag: string, code: string, overwrite?: boolean): boolean;
    /**
     * Add a function definition
     */
    addFunction(preferredName: string, code: string): string;
    /**
     * Reserve a pin for a specific use and check for conflicts
     */
    reservePin(block: Blockly.Block, pin: string, pinType: PinType, warningTag: string): void;
    /**
     * Naked values have their tab removed and end with a semicolon
     */
    scrubNakedValue(line: string): string;
    /**
     * Encode a string for Arduino
     */
    quote_(string: string): string;
    /**
     * Common scrubbing for blocks
     */
    scrub_(block: Blockly.Block, code: string): string;
    /**
     * Add code to execute every loop iteration (before main loop body)
     */
    addLoopCode(tag: string, code: string): void;
    /**
     * Add loop trap code if INFINITE_LOOP_TRAP is set
     */
    addLoopTrap(branch: string, block: Blockly.Block): string;
    /**
     * Convert Arduino type to C++ type string
     */
    getArduinoType_(type: ArduinoType): string;
    /**
     * Helper functions for no generator code
     */
    noGeneratorCodeInline(): [string, number];
    noGeneratorCodeLine(): string;
}
declare const arduinoGenerator: ArduinoGenerator;

/**
 * Board profile interface for Arduino-compatible boards
 */
interface BoardProfile {
    name: string;
    description: string;
    compilerFlag: string;
    image?: string;
    analogPins: [string, string][];
    digitalPins: [string, string][];
    pwmPins: [string, string][];
    serial: [string, string][];
    serialPins: Record<string, [string, string][]>;
    serialSpeed: [string, string][];
    spi: [string, string][];
    spiPins: Record<string, [string, string][]>;
    spiClockDivide?: [string, string][];
    i2c: [string, string][];
    i2cPins: Record<string, [string, string][]>;
    i2cSpeed: [string, string][];
    builtinLed: [string, string][];
    interrupt: [string, string][];
    bootloader?: string;
    cpu?: string;
    speed?: string;
    picture?: string;
    miniPicture?: string;
    miniPicture_hor?: string;
    upload_arg?: string;
    help_link?: string;
    builtinButton?: [string, string][];
}
/**
 * Generate digital I/O pin arrays
 */
declare function generateDigitalIo(pinStart: number, pinEnd: number): [string, string][];
/**
 * Generate analog I/O pin arrays
 */
declare function generateAnalogIo(pinStart: number, pinEnd: number): [string, string][];
/**
 * Duplicate a board profile with new properties
 */
declare function duplicateBoardProfile(originalBoard: BoardProfile, name: string, description?: string, compilerFlag?: string): BoardProfile;
/**
 * Arduino Uno board profile
 */
declare const UNO: BoardProfile;
/**
 * Arduino Nano board profile
 */
declare const NANO: BoardProfile;
/**
 * Arduino Mega board profile
 */
declare const MEGA: BoardProfile;
/**
 * Arduino Pro Mini board profile
 */
declare const PRO_MINI: BoardProfile;
/**
 * ESP32 board profile
 */
declare const ESP32: BoardProfile;
/**
 * ESP8266 board profile
 */
declare const ESP8266: BoardProfile;
declare const BOARD_KEYS: readonly ["arduino_uno", "arduino_nano", "arduino_mega", "arduino_pro_mini", "esp32", "esp8266"];
type BoardKey = (typeof BOARD_KEYS)[number];
/**
 * Collection of all available board profiles
 */
declare const BOARD_PROFILES: Record<BoardKey, BoardProfile>;
/**
 * Default board selection
 */
declare let selectedBoard: BoardProfile;
/**
 * Change the currently selected board
 */
declare function changeBoard(boardKey: string): BoardProfile | null;
/**
 * Get the currently selected board
 */
declare function getSelectedBoard(): BoardProfile;
/**
 * Get all pins (digital + analog) from the selected board
 */
declare function getAllPins(): [string, string][];
/**
 * Get all analog pins from the selected board
 */
declare function getAllPinsAnalog(): [string, string][];
/**
 * Arduino namespace for Blockly compatibility
 * Provides access to board data and utilities for blocks
 */
declare const Arduino: {
    readonly AllPins: [string, string][];
    readonly AllPinsAnalog: [string, string][];
    readonly analogPins: [string, string][];
    readonly PwmPins: [string, string][];
    readonly BuiltinLed: [string, string][];
    readonly onlyVar: [string, string][];
    Boards: {
        readonly selected: BoardProfile;
        /**
         * Refresh a block's field dropdown with updated board pin data or variables
         */
        refreshBlockFieldDropdown(block: any, fieldName: string, pinType: string, workspace?: any): void;
    };
};

/**
 * Arduino code export utilities
 * Handles exporting generated code as .ino files
 */
/**
 * Export Arduino code as a .ino file and trigger download
 */
declare function downloadIno(code: string, projectName: string): void;
/**
 * Get Arduino code as a Blob (for future verify/upload use)
 */
declare function getInoBlob(code: string): Blob;

export { Arduino, ArduinoGenerator, ArduinoType, BOARD_KEYS, BOARD_PROFILES, type BoardKey, type BoardProfile, ESP32, ESP8266, MEGA, NANO, Order, PRO_MINI, type PinType, PinTypes, StaticTyping, Types, UNO, arduinoGenerator, changeBoard, downloadIno, duplicateBoardProfile, generateAnalogIo, generateDigitalIo, getAllPins, getAllPinsAnalog, getArduinoType, getChildBlockType, getInoBlob, getSelectedBoard, getValidTypeArray, identifyNumber, selectedBoard };
