import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order, PinTypes } from '../../arduino/generator';

Arduino.forBlock['switch_button_read'] = function (block: Blockly.Block): [string, number] {
  const pin = block.getFieldValue('PIN');
  Arduino.addVariable('button' + pin, `bool buttonState_${pin} = false;`, true);
  Arduino.addLoopCode('button1' + pin, `buttonState_${pin} = digitalRead(${pin});`);
  return [`buttonState_${pin}`, Order.ATOMIC];
};

Arduino.forBlock['switch_relay'] = function (block: Blockly.Block): string {
  const pin = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  Arduino.reservePin(block, pin, PinTypes.OUTPUT, 'Relay');
  Arduino.addSetup('relay_' + pin, `  pinMode(${pin}, OUTPUT);`, false);
  return `digitalWrite(${pin}, ${state});\n`;
};

// Relay Board Init Generator (supports 1, 2, 4, 8, 16 relays)
Arduino.forBlock['relay_board_init'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'RELAY';
  const relayCount = (block as any).relayCount_ || 4; // Default to 4 if not set

  // Build pin variables and setup code dynamically
  const pinVars: string[] = [];
  const setupCodes: string[] = [];

  for (let i = 1; i <= relayCount; i++) {
    const pin = block.getFieldValue(`PIN${i}`);

    // Reserve pin
    Arduino.reservePin(block, pin, PinTypes.OUTPUT, `Relay ${i}`);

    // Add pin variable
    pinVars.push(`int ${varName}_pin${i} = ${pin};`);

    // Add setup code
    setupCodes.push(`  pinMode(${varName}_pin${i}, OUTPUT);`);
  }

  // Store pin variables
  Arduino.addInclude(`init_relay_${varName}`, pinVars.join('\n'));

  // Setup pinMode for all relays
  Arduino.addSetup(`${varName}_setup`, setupCodes.join('\n'), true);

  return '';
};

// Relay Board Control Generator
Arduino.forBlock['relay_board_control'] = function (block: Blockly.Block): string {
  const varName = block.getField('VAR')?.getText() || 'RELAY';
  const relayNum = block.getFieldValue('RELAY_NUM');
  const state = block.getFieldValue('STATE');

  return `digitalWrite(${varName}_pin${relayNum}, ${state});\n`;
};
