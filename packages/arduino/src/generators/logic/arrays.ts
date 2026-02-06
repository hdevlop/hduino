import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';
import { Types } from '../../arduino/types';

// Helper function to check if a value is a valid number string
const isNumber = (value: string): boolean => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(value);
};

/**
 * Arduino code generators for array/list blocks
 */

/**
 * Generator: array_create_with
 * Creates an array literal: {val0, val1, ...}
 */
Arduino.forBlock['array_create_with'] = function(block: Blockly.Block): [string, number] {
  const itemCount = (block as any).itemCount_ || 0;
  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(Arduino.valueToCode(block, 'ADD' + i, Order.COMMA) || 'null');
  }
  const code = '{' + items.join(', ') + '}';
  return [code, Order.ATOMIC];
};

/**
 * Generator: array_getIndex
 * Gets element at index (1-based input, converted to 0-based)
 */
Arduino.forBlock['array_getIndex'] = function(block: Blockly.Block): [string, number] {
  let at = Arduino.valueToCode(block, 'AT', Order.UNARY_NEGATION) || '1';
  const list = Arduino.valueToCode(block, 'VAR', Order.MEMBER) || '[]';

  if (isNumber(at)) {
    at = String(parseFloat(at) - 1);
  }
  const code = list + '[' + at + ']';
  return [code, Order.MEMBER];
};

/**
 * Generator: array_modify
 * Sets array element at index: arr[index] = value;
 */
Arduino.forBlock['array_modify'] = function(block: Blockly.Block): string {
  const index = Arduino.valueToCode(block, 'indice', Order.ATOMIC);
  const name = Arduino.valueToCode(block, 'name', Order.ATOMIC);
  const value = Arduino.valueToCode(block, 'value', Order.ATOMIC);
  return name + '[' + index + '] = ' + value + ';\n';
};

/**
 * Generator: array_declare
 * Declares a typed array variable with optional 2D support
 */
Arduino.forBlock['array_declare'] = function(block: Blockly.Block): string {
  const argument0 = Arduino.valueToCode(block, 'contenu', Order.ASSIGNMENT);
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const typeBlock = Arduino.getArduinoType_((Types as Record<string, any>)[block.getFieldValue('type')]);
  const choice = block.getFieldValue('choix');
  const dimension = block.getFieldValue('dim');

  switch (choice) {
    case 'c1':
      if (dimension === 'd2') {
        Arduino.variables_[varName] =
          typeBlock + ' ' + varName + '[' + argument0 + '][' + argument0 + '];';
      } else {
        Arduino.variables_[varName] =
          typeBlock + ' ' + varName + '[' + argument0 + '];';
      }
      break;
    case 'c2':
      if (dimension === 'd2') {
        const parts = argument0.split('{');
        const nb1 = parts.length - 2;
        const args = parts[2].split(',');
        const nb2 = args.length - 1;
        Arduino.variables_[varName] =
          typeBlock + ' ' + varName + '[' + nb1 + '][' + nb2 + '] = ' + argument0 + ';';
      } else {
        Arduino.variables_[varName] =
          typeBlock + ' ' + varName + '[] = ' + argument0 + ';';
      }
      break;
  }
  return '';
};

/**
 * Generator: creer_tableau
 * Creates a typed array with dynamic dimensions
 */
Arduino.forBlock['creer_tableau'] = function(block: Blockly.Block): string {
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const typeBlock = Arduino.getArduinoType_((Types as Record<string, any>)[block.getFieldValue('type')]);
  const menu = block.getFieldValue('choix');
  const dimension = block.getFieldValue('dim');
  let k = '';
  let l = '';

  switch (menu) {
    case 'c1':
      for (let i = 0; i < dimension; i++) {
        const j = Arduino.valueToCode(block, 'D' + i, Order.ASSIGNMENT);
        k += '[' + j + ']';
      }
      Arduino.variables_[varName] = typeBlock + ' ' + varName + k + ';';
      break;
    case 'c2':
      if (dimension === '1') {
        const j = Arduino.valueToCode(block, 'D0', Order.ASSIGNMENT);
        Arduino.variables_[varName] = typeBlock + ' ' + varName + '[] =' + j + ';';
      } else {
        k += '{';
        for (let i = 0; i < dimension; i++) {
          const j = Arduino.valueToCode(block, 'D' + i, Order.ASSIGNMENT);
          const nb = j.split(',');
          k += j + ',';
          l += '[' + nb.length + ']';
        }
        k = k.slice(0, k.length - 1);
        k += '}';
        Arduino.variables_[varName] = typeBlock + ' ' + varName + l + '=' + k + ';';
      }
      break;
  }
  return '';
};

/**
 * Generator: fixer_tableau
 * Sets a value at a multi-dimensional array index
 */
Arduino.forBlock['fixer_tableau'] = function(block: Blockly.Block): string {
  const value = Arduino.valueToCode(block, 'value', Order.ATOMIC);
  let code = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const dimension = block.getFieldValue('dim');
  for (let i = 0; i < dimension; i++) {
    const j = Arduino.valueToCode(block, 'D' + i, Order.ASSIGNMENT);
    code += '[' + j + ']';
  }
  code += '=' + value + ';\n';
  return code;
};

/**
 * Generator: tableau_getIndex
 * Gets value at a multi-dimensional array index
 */
Arduino.forBlock['tableau_getIndex'] = function(block: Blockly.Block): [string, number] {
  let code = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const dimension = block.getFieldValue('dim');
  for (let i = 0; i < dimension; i++) {
    const j = Arduino.valueToCode(block, 'D' + i, Order.ASSIGNMENT);
    code += '[' + j + ']';
  }
  return [code, Order.ATOMIC];
};

/**
 * Generator: lists_create_with
 * Standard Blockly list creation (delegates to array_create_with logic)
 */
Arduino.forBlock['lists_create_with'] = Arduino.forBlock['array_create_with'];

/**
 * Generator: lists_create_empty
 * Creates an empty array initializer
 */
Arduino.forBlock['lists_create_empty'] = function(block: Blockly.Block): [string, number] {
  return ['{}', Order.ATOMIC];
};

/**
 * Generator: lists_repeat
 * Arduino doesn't have a direct list repeat; generates a fill loop helper
 */
Arduino.forBlock['lists_repeat'] = function(block: Blockly.Block): [string, number] {
  const item = Arduino.valueToCode(block, 'ITEM', Order.NONE) || '0';
  const num = Arduino.valueToCode(block, 'NUM', Order.NONE) || '0';
  // Return as an initializer list — limited but usable for small arrays
  const code = '/* repeat ' + item + ' x ' + num + ' */';
  return [code, Order.ATOMIC];
};

/**
 * Generator: lists_length
 * Returns array size using sizeof
 */
Arduino.forBlock['lists_length'] = function(block: Blockly.Block): [string, number] {
  const list = Arduino.valueToCode(block, 'VALUE', Order.NONE) || '{}';
  const code = 'sizeof(' + list + ') / sizeof(' + list + '[0])';
  return [code, Order.FUNCTION_CALL];
};

/**
 * Generator: lists_isEmpty
 * Checks if array length is 0
 */
Arduino.forBlock['lists_isEmpty'] = function(block: Blockly.Block): [string, number] {
  const list = Arduino.valueToCode(block, 'VALUE', Order.NONE) || '{}';
  const code = '(sizeof(' + list + ') == 0)';
  return [code, Order.EQUALITY];
};

/**
 * Generator: lists_getIndex
 * Gets/removes element at index (FROM_START only supported in Arduino)
 */
Arduino.forBlock['lists_getIndex'] = function(block: Blockly.Block): [string, number] | string {
  const list = Arduino.valueToCode(block, 'VALUE', Order.MEMBER) || '{}';
  const mode = block.getFieldValue('MODE');
  const where = block.getFieldValue('WHERE');
  let at = Arduino.valueToCode(block, 'AT', Order.NONE) || '1';

  // Adjust 1-based to 0-based for FROM_START
  if (where === 'FROM_START') {
    if (isNumber(at)) {
      at = String(parseFloat(at) - 1);
    } else {
      at = '(' + at + ' - 1)';
    }
  } else if (where === 'FIRST') {
    at = '0';
  } else if (where === 'LAST') {
    at = 'sizeof(' + list + ') / sizeof(' + list + '[0]) - 1';
  } else if (where === 'RANDOM') {
    at = 'random(sizeof(' + list + ') / sizeof(' + list + '[0]))';
  }

  const code = list + '[' + at + ']';
  if (mode === 'REMOVE') {
    return code + ';\n';
  }
  return [code, Order.MEMBER];
};

/**
 * Generator: lists_setIndex
 * Sets element at index
 */
Arduino.forBlock['lists_setIndex'] = function(block: Blockly.Block): string {
  const list = Arduino.valueToCode(block, 'LIST', Order.MEMBER) || '{}';
  const value = Arduino.valueToCode(block, 'TO', Order.NONE) || '0';
  const where = block.getFieldValue('WHERE');
  let at = Arduino.valueToCode(block, 'AT', Order.NONE) || '1';

  if (where === 'FROM_START') {
    if (isNumber(at)) {
      at = String(parseFloat(at) - 1);
    } else {
      at = '(' + at + ' - 1)';
    }
  } else if (where === 'FIRST') {
    at = '0';
  } else if (where === 'LAST') {
    at = 'sizeof(' + list + ') / sizeof(' + list + '[0]) - 1';
  } else if (where === 'RANDOM') {
    at = 'random(sizeof(' + list + ') / sizeof(' + list + '[0]))';
  }

  return list + '[' + at + '] = ' + value + ';\n';
};
