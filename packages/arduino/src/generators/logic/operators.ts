import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

/**
 * Arduino code generators for logic operators blocks
 */

/**
 * Generator: logic_boolean
 * Returns 'true' or 'false'
 */
Arduino.forBlock['logic_boolean'] = function(block: Blockly.Block): [string, number] {
  const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

/**
 * Generator: logic_operation (AND)
 * Returns '&&' operation
 */
Arduino.forBlock['logic_operation_AND'] = function(block: Blockly.Block): [string, number] {
  let argument0 = Arduino.valueToCode(block, 'A', Order.ATOMIC) || 'false';
  let argument1 = Arduino.valueToCode(block, 'B', Order.ATOMIC) || 'false';

  const code = `${argument0} && ${argument1}`;
  return [code, Order.LOGICAL_AND];
};

/**
 * Generator: logic_operation (OR)
 * Returns '||' operation
 */
Arduino.forBlock['logic_operation_OR'] = function(block: Blockly.Block): [string, number] {
  let argument0 = Arduino.valueToCode(block, 'A', Order.LOGICAL_OR) || 'false';
  let argument1 = Arduino.valueToCode(block, 'B', Order.LOGICAL_OR) || 'false';

  const code = `${argument0} || ${argument1}`;
  return [code, Order.LOGICAL_OR];
};

/**
 * Generator: logic_operation
 * Generic logic operation handler (dispatches to AND/OR)
 */
Arduino.forBlock['logic_operation'] = function(block: Blockly.Block): [string, number] {
  const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
  const order = operator === '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;

  let argument0 = Arduino.valueToCode(block, 'A', order) || 'false';
  let argument1 = Arduino.valueToCode(block, 'B', order) || 'false';

  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

/**
 * Generator: logic_compare
 * Returns comparison operations (==, !=, <, >, <=, >=)
 */
Arduino.forBlock['logic_compare'] = function(block: Blockly.Block): [string, number] {
  const OPERATORS: Record<string, string> = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>=',
  };

  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = operator === '==' || operator === '!='
    ? Order.EQUALITY
    : Order.RELATIONAL;

  const argument0 = Arduino.valueToCode(block, 'A', order) || '0';
  const argument1 = Arduino.valueToCode(block, 'B', order) || '0';

  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

/**
 * Generator: logic_negate
 * Returns '!' operation (NOT)
 */
Arduino.forBlock['logic_negate'] = function(block: Blockly.Block): [string, number] {
  const order = Order.UNARY_PREFIX;
  const argument0 = Arduino.valueToCode(block, 'BOOL', order) || 'false';
  const code = `!${argument0}`;
  return [code, order];
};

/**
 * Generator: logic_null
 * Returns 'NULL'
 */
Arduino.forBlock['logic_null'] = function(block: Blockly.Block): [string, number] {
  const code = 'NULL';
  return [code, Order.ATOMIC];
};

/**
 * Generator: logic_ternary
 * Returns ternary operator (condition ? true_value : false_value)
 */
Arduino.forBlock['logic_ternary'] = function(block: Blockly.Block): [string, number] {
  const valueIf = Arduino.valueToCode(block, 'IF', Order.CONDITIONAL) || 'false';
  const valueThen = Arduino.valueToCode(block, 'THEN', Order.CONDITIONAL) || 'null';
  const valueElse = Arduino.valueToCode(block, 'ELSE', Order.CONDITIONAL) || 'null';

  const code = `${valueIf} ? ${valueThen} : ${valueElse}`;
  return [code, Order.CONDITIONAL];
};
