import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order, PinTypes } from '../../arduino/generator';

// === Basic generators ===

Arduino.forBlock['base_begin'] = function (block: Blockly.Block): string {
  const branch = Arduino.statementToCode(block, 'base_begin');
  Arduino.addSetup('base_begin_' + block.id, branch, true);
  return '';
};

Arduino.forBlock['base_setup'] = function (block: Blockly.Block): string {
  const branch = Arduino.statementToCode(block, 'DO');
  Arduino.addSetup('base_setup_' + block.id, branch, true);
  return '';
};

Arduino.forBlock['pinmode'] = function (block: Blockly.Block): [string, number] {
  return [block.getFieldValue('PINMODE'), Order.ATOMIC];
};

Arduino.forBlock['base_define_name'] = function (block: Blockly.Block): [string, number] {
  const code = block.getFieldValue('NAME');
  return [code, Order.ATOMIC];
};

Arduino.forBlock['base_define'] = function (block: Blockly.Block): string {
  const name = Arduino.valueToCode(block, 'NAME', Order.ATOMIC);
  const pin = block.getFieldValue('PIN');
  Arduino.addInclude(name, `#define ${name} ${pin}`);
  return '';
};

Arduino.forBlock['base_loop'] = function (block: Blockly.Block): string {
  const targetBlock = block.getInputTargetBlock('LOOP_FUNC');
  const loopBranch = targetBlock ? (Arduino.blockToCode(targetBlock) as string) : '';
  if (loopBranch) {
    Arduino.addLoop('userLoopCode', loopBranch, true);
  }
  return '';
};

Arduino.forBlock['base_setup_loop'] = function (block: Blockly.Block): string {
  const setupBranch = Arduino.statementToCode(block, 'SETUP_FUNC') as string;
  if (setupBranch) {
    Arduino.addSetup('userSetupCode', setupBranch, true);
  }
  const targetBlock = block.getInputTargetBlock('LOOP_FUNC');
  const loopBranch = targetBlock ? (Arduino.blockToCode(targetBlock) as string) : '';
  return loopBranch;
};

Arduino.forBlock['base_define_bloc'] = function (block: Blockly.Block): string {
  const branch = Arduino.statementToCode(block, 'DO') as string;
  Arduino.addVariable('base_define_bloc_' + block.id, branch, true);
  return '';
};

Arduino.forBlock['base_code'] = function (block: Blockly.Block): string {
  return block.getFieldValue('TEXT') + '\n';
};

Arduino.forBlock['base_comment'] = function (block: Blockly.Block): string {
  return '// ' + block.getFieldValue('TEXT') + '\n';
};

Arduino.forBlock['base_end'] = function (_block: Blockly.Block): string {
  return 'while(true);\n';
};

// === I/O generators ===

Arduino.forBlock['io_digitalwrite_Var'] = function (block: Blockly.Block): string {
  const pin = Arduino.valueToCode(block, 'VAR', Order.ATOMIC);
  const stateOutput = block.getFieldValue('STATE') || 'LOW';
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});\n`;
};

Arduino.forBlock['io_digitalwrite'] = function (block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN');
  const stateOutput = Arduino.valueToCode(block, 'STATE', Order.ATOMIC) || 'LOW';
  Arduino.reservePin(block, pin, PinTypes.OUTPUT, 'Digital Write');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});\n`;
};

Arduino.forBlock['io_digitalreadVar'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('VAR');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Digital Read');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`digitalRead(${pin})`, Order.ATOMIC];
};

Arduino.forBlock['io_digitalread'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Digital Read');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`digitalRead(${pin})`, Order.ATOMIC];
};

Arduino.forBlock['io_builtin_led'] = function (block: Blockly.Block): string {
  const pin = block.getFieldValue('BUILT_IN_LED');
  const stateOutput = block.getFieldValue('STATE');
  Arduino.reservePin(block, pin, PinTypes.OUTPUT, 'Set LED');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${stateOutput});\n`;
};

Arduino.forBlock['io_analogwrite'] = function (block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN');
  const stateOutput = Arduino.valueToCode(block, 'NUM', Order.ATOMIC) || '0';
  Arduino.reservePin(block, pin, PinTypes.OUTPUT, 'Analogue Write');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  const numVal = Number(stateOutput);
  if (!isNaN(numVal) && (numVal < 0 || numVal > 255)) {
    block.setWarningText('The analogue value set must be between 0 and 255', 'pwm_value');
  } else {
    block.setWarningText(null, 'pwm_value');
  }
  return `analogWrite(${pin}, ${stateOutput});\n`;
};

Arduino.forBlock['io_analogreadVar'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('VAR');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Analogue Read');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`analogRead(${pin})`, Order.ATOMIC];
};

Arduino.forBlock['io_analogread'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.reservePin(block, pin, PinTypes.INPUT, 'Analogue Read');
  Arduino.addSetup('io_' + pin, `  pinMode(${pin}, INPUT);`, false);
  return [`analogRead(${pin})`, Order.ATOMIC];
};

Arduino.forBlock['io_highlow'] = function (block: Blockly.Block): [string, number] {
  return [block.getFieldValue('STATE'), Order.ATOMIC];
};
