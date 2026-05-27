import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

Arduino.forBlock['serial_init'] = function (block: Blockly.Block): string {
  const speed = block.getFieldValue('SPEED');
  const serial = block.getFieldValue('SERIAL');
  Arduino.addSetup('setup_serial_speed', `  ${serial}.begin(${speed});`, true);
  return '';
};

Arduino.forBlock['serial_receive'] = function (_block: Blockly.Block): [string, number] {
  return ['Serial.available() > 0', Order.ATOMIC];
};

Arduino.forBlock['serial_receive_byte'] = function (_block: Blockly.Block): [string, number] {
  return ['Serial.read()', Order.ATOMIC];
};

Arduino.forBlock['serial_write'] = function (block: Blockly.Block): string {
  const text = block.getFieldValue('TEXT');
  const code = `'${text}'`;
  return `Serial.write(${code});\n`;
};

Arduino.forBlock['serial_print'] = function (block: Blockly.Block): string {
  const text = block.getFieldValue('TEXT');
  const newline = block.getFieldValue('NEWLINE') === 'TRUE';
  const code = Arduino.quote_(text);
  const method = newline ? 'println' : 'print';
  return `Serial.${method}(${code});\n`;
};
