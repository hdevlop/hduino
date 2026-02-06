import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order, PinTypes } from '../../arduino/generator';

Arduino.forBlock['bluetooth_init'] = function (block: Blockly.Block): string {
  const pin0 = block.getFieldValue('PIN0');
  const pin1 = block.getFieldValue('PIN1');
  const speed = block.getFieldValue('SPEED');

  Arduino.reservePin(block, pin0, PinTypes.SERIAL, 'Bluetooth TX');
  Arduino.reservePin(block, pin1, PinTypes.SERIAL, 'Bluetooth RX');
  Arduino.addInclude('bluetooth_Soft', '#include <SoftwareSerial.h>');
  Arduino.addInclude('bluetooth_init', `SoftwareSerial BT(${pin1}, ${pin0}); // RX, TX`);
  Arduino.addSetup('setup_bluetooth', `  BT.begin(${speed});`, true);
  return '';
};

Arduino.forBlock['bluetooth_receive'] = function (_block: Blockly.Block): [string, number] {
  return ['BT.available() > 0', Order.ATOMIC];
};

Arduino.forBlock['bluetooth_receive_byte'] = function (_block: Blockly.Block): [string, number] {
  return ['BT.read()', Order.ATOMIC];
};

Arduino.forBlock['bluetooth_write'] = function (block: Blockly.Block): string {
  const argument0 = Arduino.valueToCode(block, 'BT', Order.UNARY_POSTFIX);
  return `BT.write(${argument0});\n`;
};
