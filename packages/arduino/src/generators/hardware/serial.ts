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
  const argument0 = Arduino.valueToCode(block, 'SERIAL', Order.UNARY_POSTFIX);
  return `Serial.write(${argument0});\n`;
};
