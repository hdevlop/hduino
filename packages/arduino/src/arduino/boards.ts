/**
 * Board profile interface for Arduino-compatible boards
 */
export interface BoardProfile {
  name: string;
  description: string;
  compilerFlag: string;
  image?: string; // Path to board image for UI
  analogPins: [string, string][];
  digitalPins: [string, string][]; // All pins that can be used as digital (includes analog pins on some boards)
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
export function generateDigitalIo(pinStart: number, pinEnd: number): [string, string][] {
  const digitalIo: [string, string][] = [];
  for (let i = pinStart; i <= pinEnd; i++) {
    digitalIo.push([i.toString(), i.toString()]);
  }
  return digitalIo;
}

/**
 * Generate analog I/O pin arrays
 */
export function generateAnalogIo(pinStart: number, pinEnd: number): [string, string][] {
  const analogIo: [string, string][] = [];
  for (let i = pinStart; i <= pinEnd; i++) {
    analogIo.push([`A${i}`, `A${i}`]);
  }
  return analogIo;
}

/**
 * Duplicate a board profile with new properties
 */
export function duplicateBoardProfile(
  originalBoard: BoardProfile,
  name: string,
  description?: string,
  compilerFlag?: string
): BoardProfile {
  return {
    ...originalBoard,
    name,
    description: description || originalBoard.description,
    compilerFlag: compilerFlag || originalBoard.compilerFlag,
  };
}

/**
 * Common serial speed options
 */
const SERIAL_SPEEDS: [string, string][] = [
  ['300', '300'],
  ['600', '600'],
  ['1200', '1200'],
  ['2400', '2400'],
  ['4800', '4800'],
  ['9600', '9600'],
  ['14400', '14400'],
  ['19200', '19200'],
  ['28800', '28800'],
  ['31250', '31250'],
  ['38400', '38400'],
  ['57600', '57600'],
  ['115200', '115200'],
];

/**
 * Common SPI clock divide options
 */
const SPI_CLOCK_DIVIDES: [string, string][] = [
  ['2 (8MHz)', 'SPI_CLOCK_DIV2'],
  ['4 (4MHz)', 'SPI_CLOCK_DIV4'],
  ['8 (2MHz)', 'SPI_CLOCK_DIV8'],
  ['16 (1MHz)', 'SPI_CLOCK_DIV16'],
  ['32 (500KHz)', 'SPI_CLOCK_DIV32'],
  ['64 (250KHz)', 'SPI_CLOCK_DIV64'],
  ['128 (125KHz)', 'SPI_CLOCK_DIV128'],
];

/**
 * Arduino Uno board profile
 */
export const UNO: BoardProfile = {
  name: 'Arduino Uno',
  description: 'Arduino Uno standard compatible board',
  compilerFlag: 'arduino:avr:uno',
  image: '/boards/uno.png',
  analogPins: generateAnalogIo(0, 5),
  digitalPins: [...generateDigitalIo(0, 13), ...generateAnalogIo(0, 5)],
  pwmPins: [
    ['3', '3'],
    ['5', '5'],
    ['6', '6'],
    ['9', '9'],
    ['10', '10'],
    ['11', '11'],
  ],
  serial: [['serial', 'Serial']],
  serialPins: { Serial: [['RX', '0'], ['TX', '1']] },
  serialSpeed: SERIAL_SPEEDS,
  spi: [['SPI', 'SPI']],
  spiPins: { SPI: [['MOSI', '11'], ['MISO', '12'], ['SCK', '13']] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [['I2C', 'Wire']],
  i2cPins: { Wire: [['SDA', 'A4'], ['SCL', 'A5']] },
  i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
  builtinLed: [['BUILTIN_1', '13']],
  interrupt: [['interrupt0', '2'], ['interrupt1', '3']],
  bootloader: 'uno',
};

/**
 * Arduino Nano board profile
 */
export const NANO: BoardProfile = {
  name: 'Arduino Nano',
  description: 'Arduino Nano with ATmega328p board',
  compilerFlag: 'arduino:avr:nano',
  image: '/boards/nano.png',
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
  bootloader: 'nano',
};

/**
 * Arduino Mega board profile
 */
export const MEGA: BoardProfile = {
  name: 'Arduino Mega',
  description: 'Arduino Mega-compatible board',
  compilerFlag: 'arduino:avr:mega:cpu=atmega2560',
  image: '/boards/mega.png',
  analogPins: generateAnalogIo(0, 15),
  digitalPins: [...generateDigitalIo(0, 53), ...generateAnalogIo(0, 15)],
  pwmPins: [...generateDigitalIo(2, 13), ...generateDigitalIo(44, 46)],
  serial: [
    ['serial', 'Serial'],
    ['serial_1', 'Serial1'],
    ['serial_2', 'Serial2'],
    ['serial_3', 'Serial3'],
  ],
  serialPins: {
    Serial: [['TX', '0'], ['RX', '1']],
    Serial1: [['TX', '18'], ['RX', '19']],
    Serial2: [['TX', '16'], ['RX', '17']],
    Serial3: [['TX', '14'], ['RX', '15']],
  },
  serialSpeed: SERIAL_SPEEDS,
  spi: [['SPI', 'SPI']],
  spiPins: { SPI: [['MOSI', '51'], ['MISO', '50'], ['SCK', '52']] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [['I2C', 'Wire']],
  i2cPins: { Wire: [['SDA', '20'], ['SCL', '21']] },
  i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
  builtinLed: UNO.builtinLed,
  interrupt: [
    ['interrupt0', '2'],
    ['interrupt1', '3'],
    ['interrupt2', '21'],
    ['interrupt3', '20'],
    ['interrupt4', '19'],
    ['interrupt5', '18'],
  ],
  bootloader: 'mega',
};

/**
 * Arduino Pro Mini board profile
 */
export const PRO_MINI: BoardProfile = {
  name: 'Arduino Pro Mini',
  description: 'Arduino Pro Mini with ATmega328p board',
  compilerFlag: 'arduino:avr:pro:cpu=16MHzatmega328',
  image: '/boards/pro.png',
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
  bootloader: 'pro',
};

/**
 * ESP32 board profile
 */
export const ESP32: BoardProfile = {
  name: 'ESP32',
  description: 'ESP32 development board',
  compilerFlag: 'esp32:esp32:esp32',
  image: '/boards/esp32.png',
  analogPins: [
    ...generateAnalogIo(0, 19),
    ['A32', '32'],
    ['A33', '33'],
    ['A34', '34'],
    ['A35', '35'],
    ['A36', '36'],
    ['A39', '39'],
  ],
  digitalPins: [
    ...generateDigitalIo(0, 5),
    ...generateDigitalIo(12, 19),
    ...generateDigitalIo(21, 23),
    ...generateDigitalIo(25, 27),
    ...generateDigitalIo(32, 33),
  ],
  pwmPins: generateDigitalIo(0, 33),
  serial: [
    ['serial', 'Serial'],
    ['serial_1', 'Serial1'],
    ['serial_2', 'Serial2'],
  ],
  serialPins: {
    Serial: [['TX', '1'], ['RX', '3']],
    Serial1: [['TX', '10'], ['RX', '9']],
    Serial2: [['TX', '17'], ['RX', '16']],
  },
  serialSpeed: SERIAL_SPEEDS,
  spi: [['SPI', 'SPI'], ['HSPI', 'HSPI'], ['VSPI', 'VSPI']],
  spiPins: {
    SPI: [['MOSI', '23'], ['MISO', '19'], ['SCK', '18']],
    HSPI: [['MOSI', '13'], ['MISO', '12'], ['SCK', '14']],
    VSPI: [['MOSI', '23'], ['MISO', '19'], ['SCK', '18']],
  },
  i2c: [['I2C', 'Wire']],
  i2cPins: { Wire: [['SDA', '21'], ['SCL', '22']] },
  i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
  builtinLed: [['BUILTIN_1', '2']],
  interrupt: generateDigitalIo(0, 39),
};

/**
 * ESP8266 board profile
 */
export const ESP8266: BoardProfile = {
  name: 'ESP8266',
  description: 'ESP8266 development board',
  compilerFlag: 'esp8266:esp8266:generic',
  image: '/boards/esp8266.png',
  analogPins: [['A0', 'A0']],
  digitalPins: [
    ['D0', 'D0'],
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D6'],
    ['D7', 'D7'],
    ['D8', 'D8'],
  ],
  pwmPins: [
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D6'],
    ['D7', 'D7'],
    ['D8', 'D8'],
  ],
  serial: [['serial', 'Serial']],
  serialPins: { Serial: [['RX', 'RX'], ['TX', 'TX']] },
  serialSpeed: SERIAL_SPEEDS,
  spi: [['SPI', 'SPI']],
  spiPins: { SPI: [['MOSI', 'D7'], ['MISO', 'D6'], ['SCK', 'D5']] },
  spiClockDivide: SPI_CLOCK_DIVIDES,
  i2c: [['I2C', 'Wire']],
  i2cPins: { Wire: [['SDA', 'D2'], ['SCL', 'D1']] },
  i2cSpeed: UNO.i2cSpeed,
  builtinLed: [['BUILTIN_1', 'D4']],
  interrupt: [
    ['D0', 'D0'],
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D6'],
    ['D7', 'D7'],
    ['D8', 'D8'],
  ],
};

// ============================================================
// Board Keys - Single Source of Truth
// ============================================================

export const BOARD_KEYS = [
  'arduino_uno',
  'arduino_nano',
  'arduino_mega',
  'arduino_pro_mini',
  'esp32',
  'esp8266',
] as const;

export type BoardKey = (typeof BOARD_KEYS)[number];

/**
 * Collection of all available board profiles
 */
export const BOARD_PROFILES: Record<BoardKey, BoardProfile> = {
  arduino_uno: UNO,
  arduino_nano: NANO,
  arduino_mega: MEGA,
  arduino_pro_mini: PRO_MINI,
  esp32: ESP32,
  esp8266: ESP8266,
};

/**
 * Default board selection
 */
export let selectedBoard: BoardProfile = BOARD_PROFILES.arduino_uno;

/**
 * Change the currently selected board
 */
export function changeBoard(boardKey: string): BoardProfile | null {
  if (boardKey in BOARD_PROFILES) {
    selectedBoard = BOARD_PROFILES[boardKey as BoardKey];
    return selectedBoard;
  }
  console.warn(`Tried to set non-existing Arduino board: ${boardKey}`);
  return null;
}

/**
 * Get the currently selected board
 */
export function getSelectedBoard(): BoardProfile {
  return selectedBoard;
}

/**
 * Get all pins (digital + analog) from the selected board
 */
export function getAllPins(): [string, string][] {
  return selectedBoard.digitalPins;
}

/**
 * Get all analog pins from the selected board
 */
export function getAllPinsAnalog(): [string, string][] {
  return selectedBoard.analogPins;
}

/**
 * Arduino namespace for Blockly compatibility
 * Provides access to board data and utilities for blocks
 */
export const Arduino = {
  get AllPins(): [string, string][] {
    return getAllPins();
  },
  get AllPinsAnalog(): [string, string][] {
    return getAllPinsAnalog();
  },
  get analogPins(): [string, string][] {
    return getAllPinsAnalog();
  },
  get PwmPins(): [string, string][] {
    return selectedBoard.pwmPins;
  },
  get BuiltinLed(): [string, string][] {
    return selectedBoard.builtinLed;
  },
  get onlyVar(): [string, string][] {
    // Placeholder for variable-only dropdown
    // Return a default option to prevent empty array error
    return [['', '']];
  },
  Boards: {
    get selected(): BoardProfile {
      return selectedBoard;
    },
    /**
     * Refresh a block's field dropdown with updated board pin data or variables
     */
    refreshBlockFieldDropdown(block: any, fieldName: string, pinType: string, workspace?: any): void {
      const field = block.getField(fieldName);
      if (!field) return;

      let pins: [string, string][];
      switch (pinType) {
        case 'AllPins':
          pins = getAllPins();
          break;
        case 'AllPinsAnalog':
        case 'analogPins':
          pins = getAllPinsAnalog();
          break;
        case 'digitalPins':
          pins = selectedBoard.digitalPins;
          break;
        case 'pwmPins':
          pins = selectedBoard.pwmPins;
          break;
        case 'builtinLed':
          pins = selectedBoard.builtinLed;
          break;
        case 'onlyVar':
          // Get actual variables from workspace
          if (!workspace) {
            // Fallback when no workspace available
            pins = [['', '']];
            break;
          }
          // Get all variables from workspace
          const variables = workspace.getVariableMap().getVariablesOfType('');
          if (variables.length === 0) {
            // No variables exist - show empty placeholder
            pins = [['', '']];
          } else {
            // Map variables to dropdown format [display, value]
            pins = variables.map((v: any) => [v.getName(), v.getName()]);
          }
          break;
        default:
          pins = [];
      }

      if (pins.length > 0 && field.menuGenerator_) {
        field.menuGenerator_ = pins;
      }
    },
  },
};
