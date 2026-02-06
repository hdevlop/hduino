import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

Arduino.forBlock['switch_button_read'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.addVariable('button' + pin, `bool buttonState_${pin} = false;`, true);
  Arduino.addLoopCode('button1' + pin, `buttonState_${pin} = digitalRead(${pin});`);
  return [`buttonState_${pin}`, Order.ATOMIC];
};
