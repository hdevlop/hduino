import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';
import { Types } from '../../arduino/types';
import { getSelectedBoard } from '../../arduino/boards';

/**
 * Arduino code generators for text blocks
 */


/**
 * Generator: text
 * Returns quoted text string
 */
Arduino.forBlock['text'] = function(block: Blockly.Block): [string, number] {
  const code = Arduino.quote_(block.getFieldValue('TEXT'));
  return [code, Order.ATOMIC];
};

/**
 * Generator: Simpletext
 * Returns text with single quotes
 */
Arduino.forBlock['Simpletext'] = function(block: Blockly.Block): [string, number] {
  const TEXT = block.getFieldValue('TEXT');
  const code = `'${TEXT}'`;
  return [code, Order.ATOMIC];
};

/**
 * Generator: text_join
 * Join multiple text strings
 */
Arduino.forBlock['text_join'] = function(block: Blockly.Block & { itemCount_?: number }): [string, number] {
  let code: string;

  if (block.itemCount_ === 0) {
    return ['""', Order.ATOMIC];
  } else if (block.itemCount_ === 1) {
    const argument0 = Arduino.valueToCode(block, 'ADD0', Order.UNARY_POSTFIX) || '""';
    code = 'String(' + argument0 + ')';
    return [code, Order.UNARY_POSTFIX];
  } else {
    const parts: string[] = [];
    for (let n = 0; n < (block.itemCount_ || 0); n++) {
      const argument = Arduino.valueToCode(block, 'ADD' + n, Order.NONE);
      if (argument === '') {
        parts[n] = '""';
      } else {
        parts[n] = 'String(' + argument + ')';
      }
    }
    code = parts.join(' + ');
    return [code, Order.UNARY_POSTFIX];
  }
};

/**
 * Generator: text_length
 * Get length of string
 */
Arduino.forBlock['text_length'] = function(block: Blockly.Block): [string, number] {
  const argument0 = Arduino.valueToCode(block, 'VALUE', Order.UNARY_POSTFIX) || '""';
  const code = 'String(' + argument0 + ').length()';
  return [code, Order.UNARY_POSTFIX];
};

/**
 * Generator: text_isEmpty
 * Check if string is empty
 */
Arduino.forBlock['text_isEmpty'] = function(block: Blockly.Block): [string, number] {
  const func = [
    'boolean ' + Arduino.DEF_FUNC_NAME + '(String msg) {',
    '  if (msg.length() == 0) {',
    '    return true;',
    '  } else {',
    '    return false;',
    '  }',
    '}',
  ];
  const funcName = Arduino.addFunction('dfg', func.join('\n'));

  let argument0 = Arduino.valueToCode(block, 'VALUE', Order.UNARY_POSTFIX);
  if (argument0 === '') {
    argument0 = '""';
  } else {
    argument0 = 'String(' + argument0 + ')';
  }
  const code = funcName + '(' + argument0 + ')';
  return [code, Order.UNARY_POSTFIX];
};

/**
 * Generator: text_append
 * Append text to a variable
 */
Arduino.forBlock['text_append'] = function(block: Blockly.Block): string {
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  ) || '"v"';
  let argument0 = Arduino.valueToCode(block, 'TEXT', Order.UNARY_POSTFIX) || '"v"';
  if (argument0 === '') {
    argument0 = '""';
  } else {
    argument0 = 'String(' + argument0 + ')';
  }
  return varName + ' += ' + argument0 + ';\n';
};

/**
 * Generator: text_trim
 * Trim whitespace from string
 */
Arduino.forBlock['text_trim'] = function(block: Blockly.Block): [string, number] {
  const OPERATORS: Record<string, string> = {
    LEFT: '.trim()',
    RIGHT: '.trim()',
    BOTH: '.trim()',
  };

  const mode = block.getFieldValue('MODE');
  const operator = OPERATORS[mode];
  let argument0 = Arduino.valueToCode(block, 'TEXT', Order.UNARY_POSTFIX);

  if (argument0 === '') {
    argument0 = '""';
  } else {
    argument0 = 'String(' + argument0 + ')';
  }
  return [argument0 + operator, Order.UNARY_POSTFIX];
};

/**
 * Generator: text_print
 * Print text to serial
 */
Arduino.forBlock['text_print'] = function(block: Blockly.Block): string {
  const serialId = getSelectedBoard().serial[0][1];
  const setupCode = serialId + '.begin(9600);';
  Arduino.addSetup('serial_' + serialId, setupCode, false);

  let argument0 = Arduino.valueToCode(block, 'TEXT', Order.NONE);
  if (argument0 === '') {
    argument0 = '""';
  } else {
    argument0 = 'String(' + argument0 + ')';
  }
  return serialId + '.print(' + argument0 + ');\n';
};

/**
 * Generator: text_prompt_ext
 * Prompt user for input (text or number)
 */
Arduino.forBlock['text_prompt_ext'] = function(block: Blockly.Block): [string, number] {
  // Get the first Serial peripheral of arduino board
  const serialId = getSelectedBoard().serial[0][1];
  const returnType = block.getFieldValue('TYPE');

  // The function code changes based on reading a number or string
  const func: string[] = [];
  const toNumber = returnType === 'NUMBER';

  if (toNumber) {
    func.push('int ' + Arduino.DEF_FUNC_NAME + '(String msg) {');
  } else {
    func.push('String ' + Arduino.DEF_FUNC_NAME + '(String msg) {');
  }
  func.push('  ' + serialId + '.println(msg);');
  func.push('  boolean stringComplete = false;');

  if (toNumber) {
    func.push('  int content = 0;');
  } else {
    func.push('  String content = "";');
  }

  func.push('  while (stringComplete == false) {');
  func.push('    if (' + serialId + '.available()) {');

  if (toNumber) {
    func.push('      content = ' + serialId + '.parseInt();');
    func.push('      stringComplete = true;');
  } else {
    func.push('      char readChar = (char)' + serialId + '.read();');
    func.push('      if (readChar == \'\\n\' || readChar == \'\\r\') {');
    func.push('        stringComplete = true;');
    func.push('      } else {');
    func.push('        content += readChar;');
    func.push('      }');
  }

  func.push('    }');
  func.push('  }');
  func.push('  // Empty incoming serial buffer');
  func.push('  while(Serial.available()) { Serial.read(); };');
  func.push('  return content;');
  func.push('}');

  const funcName = Arduino.addFunction(
    'getUserInputPrompt' + returnType,
    func.join('\n')
  );

  // Only overwrite the serial set up if not present already
  const setupCode = serialId + '.begin(9600);';
  Arduino.addSetup('serial_' + serialId, setupCode, false);

  const msg = Arduino.valueToCode(block, 'TEXT', Order.NONE) || '""';
  const code = funcName + '(' + msg + ')';

  return [code, Order.UNARY_POSTFIX];
};
