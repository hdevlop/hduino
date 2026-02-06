import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

Arduino.forBlock['millis'] = function (_block: Blockly.Block): [string, number] {
  return ['millis()', Order.ATOMIC];
};

Arduino.forBlock['micros'] = function (_block: Blockly.Block): [string, number] {
  return ['micros()', Order.ATOMIC];
};

Arduino.forBlock['millis_sec'] = function (_block: Blockly.Block): [string, number] {
  return ['millis()/1000', Order.ATOMIC];
};

Arduino.forBlock['base_delay'] = function (block: Blockly.Block): string {
  const delayTime = Arduino.valueToCode(block, 'DELAY_TIME', Order.ATOMIC);
  return `delay(${delayTime});\n`;
};

Arduino.forBlock['base_delay_sec'] = function (block: Blockly.Block): string {
  const delayTime = Arduino.valueToCode(block, 'DELAY_TIME', Order.ATOMIC);
  return `delay(${delayTime} * 1000);\n`;
};

Arduino.forBlock['tempo_no_delay'] = function (block: Blockly.Block): string {
  const unit = block.getFieldValue('unite');
  const delayTime = Arduino.valueToCode(block, 'DELAY_TIME', Order.ATOMIC);
  const body = Arduino.statementToCode(block, 'branche') as string;
  const temps = 'temps' + delayTime;
  Arduino.addDeclaration('temporisation' + delayTime, `long ${temps} = 0;`);

  let code: string;
  switch (unit) {
    case 'us':
      code = `if ((micros()-${temps}>=${delayTime}) {\n  ${temps}=micros();\n${body}}\n`;
      break;
    case 'ms':
      code = `if ((millis()-${temps}>=${delayTime}) {\n  ${temps}=millis();\n${body}}\n`;
      break;
    case 's':
      code = `if ((millis()-${temps}>=${delayTime}*1000) {\n  ${temps}=millis();\n${body}}\n`;
      break;
    default:
      code = '';
  }
  return code;
};

Arduino.forBlock['io_pulsein'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  const stat = block.getFieldValue('STAT');
  Arduino.addSetup('setup_input_' + pin, `pinMode(${pin}, INPUT);`, true);
  return [`pulseIn(${pin},${stat})`, Order.ATOMIC];
};

Arduino.forBlock['io_pulsein_timeout'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  const stat = block.getFieldValue('STAT');
  const timeout = Arduino.valueToCode(block, 'TIMEOUT', Order.ATOMIC) || '0';
  Arduino.addSetup('setup_input_' + pin, `pinMode(${pin}, INPUT);`, true);
  return [`pulseIn(${pin}, ${stat}, ${timeout})`, Order.ATOMIC];
};
