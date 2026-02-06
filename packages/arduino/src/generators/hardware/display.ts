import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order, PinTypes } from '../../arduino/generator';

Arduino.forBlock['led_digitalwrite'] = function (block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN');
  const stateOutput = block.getFieldValue('STATE') || 'LOW';
  Arduino.reservePin(block, pin, PinTypes.OUTPUT, 'LED');
  if (pin !== 'j' && pin !== 'i') {
    Arduino.addSetup('io_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  }
  return `digitalWrite(${pin}, ${stateOutput});\n`;
};

Arduino.forBlock['lcd_i2c_lcdinit'] = function (block: Blockly.Block): string {
  const address = block.getFieldValue('ADD') || '0x27';
  const size = block.getFieldValue('SIZE') || '16x2';
  const cursor = block.getFieldValue('Cr');

  // Parse size (e.g., "16x2" -> cols=16, rows=2)
  const [cols, rows] = size.split('x').map((s: string) => s.trim());

  Arduino.addInclude('define_Wire', '#include <Wire.h>');
  Arduino.addInclude('define_LiquidCrystal_I2C', '#include <LiquidCrystal_I2C.h>');
  Arduino.addDeclaration('var_lcd', `LiquidCrystal_I2C lcd(${address}, ${cols}, ${rows});`);

  let setup = '  lcd.init();\n';
  setup += '  lcd.backlight();\n';
  setup += '  lcd.noBlink();\n';
  if (cursor === 'TRUE') {
    setup += '  lcd.cursor();\n';
  } else {
    setup += '  lcd.noCursor();\n';
  }
  Arduino.addSetup('setup_lcd', setup, true);
  return '';
};

Arduino.forBlock['lcd_i2c_lcdclear'] = function (_block: Blockly.Block): string {
  return 'lcd.clear();\n';
};

Arduino.forBlock['lcd_i2c_lcdwrite'] = function (block: Blockly.Block): string {
  const text = Arduino.valueToCode(block, 'TEXT', Order.UNARY_POSTFIX) || "''";
  const col = block.getFieldValue('Col');
  const row = block.getFieldValue('Row');
  return `lcd.setCursor(${col},${row});\nlcd.print(${text});\n`;
};
