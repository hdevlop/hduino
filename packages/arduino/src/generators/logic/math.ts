import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

/**
 * Arduino code generators for math blocks
 */

/**
 * Generator: math_numbers (legacy)
 * Numeric value
 */
Arduino.forBlock['math_numbers'] = function(block: Blockly.Block): [string, number] {
  const code = window.parseFloat(block.getFieldValue('NUM'));
  const order = code < 0 ? Order.UNARY_PREFIX : Order.ATOMIC;
  return [code.toString(), order];
};

/**
 * Generator: math_number
 * Numeric value
 */
Arduino.forBlock['math_number'] = function(block: Blockly.Block): [string, number] {
  const code = window.parseFloat(block.getFieldValue('NUM'));
  const order = code < 0 ? Order.UNARY_PREFIX : Order.ATOMIC;
  return [code.toString(), order];
};

/**
 * Operator mapping for math_arithmetic
 */
const ARITHMETIC_OPERATORS: Record<string, [string | null, number]> = {
  ADD: [' + ', Order.ADDITIVE],
  MINUS: [' - ', Order.ADDITIVE],
  MULTIPLY: [' * ', Order.MULTIPLICATIVE],
  DIVIDE: [' / ', Order.MULTIPLICATIVE],
  POWER: [null, Order.NONE], // Handle power separately
};

/**
 * Generator: math_arithmetic
 * Basic arithmetic operators and power
 */
Arduino.forBlock['math_arithmetic'] = function(block: Blockly.Block): [string, number] {
  const mode = block.getFieldValue('OP');
  const tuple = ARITHMETIC_OPERATORS[mode];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Arduino.valueToCode(block, 'A', order) || '0';
  const argument1 = Arduino.valueToCode(block, 'B', order) || '0';

  if (!operator) {
    const code = `pow(${argument0}, ${argument1})`;
    return [code, Order.UNARY_POSTFIX];
  }

  const code = argument0 + operator + argument1;
  return [code, order];
};

/**
 * Generator: math_single
 * Advanced math functions
 */
Arduino.forBlock['math_single'] = function(block: Blockly.Block): [string, number] {
  const operator = block.getFieldValue('OP');
  let code: string;
  let arg: string;

  if (operator === 'NEG') {
    // Negation is a special case given its different operator precedents
    arg = Arduino.valueToCode(block, 'NUM', Order.UNARY_PREFIX) || '0';
    if (arg[0] === '-') {
      // --3 is not legal in C++ in this context
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Order.UNARY_PREFIX];
  }

  if (operator === 'ABS' || operator.substring(0, 5) === 'ROUND') {
    arg = Arduino.valueToCode(block, 'NUM', Order.UNARY_POSTFIX) || '0';
  } else if (operator === 'SIN' || operator === 'COS' || operator === 'TAN') {
    arg = Arduino.valueToCode(block, 'NUM', Order.MULTIPLICATIVE) || '0';
  } else {
    arg = Arduino.valueToCode(block, 'NUM', Order.NONE) || '0';
  }

  // First, handle cases which generate values that don't need parentheses
  switch (operator) {
    case 'ABS':
      code = `abs(${arg})`;
      break;
    case 'ROOT':
      code = `sqrt(${arg})`;
      break;
    case 'LN':
      code = `log(${arg})`;
      break;
    case 'EXP':
      code = `exp(${arg})`;
      break;
    case 'POW10':
      code = `pow(10,${arg})`;
      break;
    case 'ROUND':
      code = `round(${arg})`;
      break;
    case 'ROUNDUP':
      code = `ceil(${arg})`;
      break;
    case 'ROUNDDOWN':
      code = `floor(${arg})`;
      break;
    case 'SIN':
      code = `sin(${arg} / 180 * M_PI)`;
      break;
    case 'COS':
      code = `cos(${arg} / 180 * M_PI)`;
      break;
    case 'TAN':
      code = `tan(${arg} / 180 * M_PI)`;
      break;
    default:
      // Second, handle cases which generate values that may need parentheses
      switch (operator) {
        case 'LOG10':
          code = `log(${arg}) / log(10)`;
          return [code, Order.MULTIPLICATIVE];
        case 'ASIN':
          code = `asin(${arg}) / M_PI * 180`;
          return [code, Order.MULTIPLICATIVE];
        case 'ACOS':
          code = `acos(${arg}) / M_PI * 180`;
          return [code, Order.MULTIPLICATIVE];
        case 'ATAN':
          code = `atan(${arg}) / M_PI * 180`;
          return [code, Order.MULTIPLICATIVE];
        default:
          throw new Error('Unknown math operator: ' + operator);
      }
  }

  return [code, Order.UNARY_POSTFIX];
};

/**
 * Generator: math_trig
 * Trigonometric functions - uses same generator as math_single
 */
Arduino.forBlock['math_trig'] = Arduino.forBlock['math_single'];

/**
 * Generator: math_round
 * Rounding functions - uses same generator as math_single
 */
Arduino.forBlock['math_round'] = Arduino.forBlock['math_single'];

/**
 * Generator: math_constant
 * Mathematical constants
 */
Arduino.forBlock['math_constant'] = function(block: Blockly.Block): [string, number] {
  const CONSTANTS: Record<string, [string, number]> = {
    PI: ['M_PI', Order.MEMBER],
    E: ['E', Order.MEMBER],
    GOLDEN_RATIO: ['(1 + sqrt(5)) / 2', Order.MULTIPLICATIVE],
    SQRT2: ['SQRT2', Order.MEMBER],
    SQRT1_2: ['SQRT1_2', Order.MEMBER],
    INFINITY: ['Infinity', Order.ATOMIC],
  };

  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

/**
 * Generator: math_number_property
 * Check number properties
 */
Arduino.forBlock['math_number_property'] = function(block: Blockly.Block): [string, number] {
  const numberToCheck = Arduino.valueToCode(block, 'NUMBER_TO_CHECK', Order.MULTIPLICATIVE) || '0';
  const property = block.getFieldValue('PROPERTY');
  let code: string;

  if (property === 'PRIME') {
    const func = [
      'boolean ' + Arduino.DEF_FUNC_NAME + '(int n) {',
      '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
      '  if (n == 2 || n == 3) {',
      '    return true;',
      '  }',
      '  // False if n is NaN, negative, is 1.',
      '  // And false if n is divisible by 2 or 3.',
      '  if (isnan(n) || (n <= 1) || (n == 1) || (n % 2 == 0) || (n % 3 == 0)) {',
      '    return false;',
      '  }',
      '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
      '  for (int x = 6; x <= sqrt(n) + 1; x += 6) {',
      '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
      '      return false;',
      '    }',
      '  }',
      '  return true;',
      '}',
    ];
    const funcName = Arduino.addFunction('mathIsPrime', func.join('\n'));
    Arduino.addInclude('math', '#include <math.h>');
    code = `${funcName}(${numberToCheck})`;
    return [code, Order.UNARY_POSTFIX];
  }

  switch (property) {
    case 'EVEN':
      code = `${numberToCheck} % 2 == 0`;
      break;
    case 'ODD':
      code = `${numberToCheck} % 2 == 1`;
      break;
    case 'WHOLE':
      Arduino.addInclude('math', '#include <math.h>');
      code = `(floor(${numberToCheck}) == ${numberToCheck})`;
      break;
    case 'POSITIVE':
      code = `${numberToCheck} > 0`;
      break;
    case 'NEGATIVE':
      code = `${numberToCheck} < 0`;
      break;
    case 'DIVISIBLE_BY':
      const divisor = Arduino.valueToCode(block, 'DIVISOR', Order.MULTIPLICATIVE) || '0';
      code = `${numberToCheck} % ${divisor} == 0`;
      break;
    default:
      throw new Error('Unknown property: ' + property);
  }

  return [code, Order.EQUALITY];
};

/**
 * Generator: math_change
 * Add to a variable in place
 */
Arduino.forBlock['math_change'] = function(block: Blockly.Block): string {
  const argument0 = Arduino.valueToCode(block, 'DELTA', Order.ADDITIVE) || '0';
  const varName = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const code = `${varName} = ${varName} + ${argument0};\n`;
  return code;
};

/**
 * Generator: math_on_list
 * Operations on lists - not implemented for Arduino
 */
Arduino.forBlock['math_on_list'] = function(): [string, number] {
  return ['', Order.ATOMIC];
};

/**
 * Generator: math_modulo
 * Modulo operation
 */
Arduino.forBlock['math_modulo'] = function(block: Blockly.Block): [string, number] {
  const argument0 = Arduino.valueToCode(block, 'DIVIDEND', Order.MULTIPLICATIVE) || '0';
  const argument1 = Arduino.valueToCode(block, 'DIVISOR', Order.MULTIPLICATIVE) || '0';
  const code = `${argument0} % ${argument1}`;
  return [code, Order.MULTIPLICATIVE];
};

/**
 * Generator: math_constrain
 * Constrain a number between two limits
 */
Arduino.forBlock['math_constrain'] = function(block: Blockly.Block): [string, number] {
  const argument0 = Arduino.valueToCode(block, 'VALUE', Order.NONE) || '0';
  const argument1 = Arduino.valueToCode(block, 'LOW', Order.NONE) || '0';
  const argument2 = Arduino.valueToCode(block, 'HIGH', Order.NONE) || '0';
  const code =
    `(${argument0} < ${argument1} ? ${argument1} : ( ${argument0} > ${argument2} ? ${argument2} : ${argument0}))`;
  return [code, Order.UNARY_POSTFIX];
};

/**
 * Generator: math_random_int
 * Random integer between two values
 */
Arduino.forBlock['math_random_int'] = function(block: Blockly.Block): [string, number] {
  const argument0 = Arduino.valueToCode(block, 'FROM', Order.NONE) || '0';
  const argument1 = Arduino.valueToCode(block, 'TO', Order.NONE) || '0';

  const func = [
    'int ' + Arduino.DEF_FUNC_NAME + '(int min, int max) {',
    '  if (min > max) {',
    '    // Swap min and max to ensure min is smaller.',
    '    int temp = min;',
    '    min = max;',
    '    max = temp;',
    '  }',
    '  return min + (rand() % (max - min + 1));',
    '}',
  ];
  const funcName = Arduino.addFunction('mathRandomInt', func.join('\n'));
  const code = `${funcName}(${argument0}, ${argument1})`;
  return [code, Order.UNARY_POSTFIX];
};

/**
 * Generator: math_random_float
 * Random float between 0.0 and 1.0
 */
Arduino.forBlock['math_random_float'] = function(): [string, number] {
  return ['(rand() / RAND_MAX)', Order.UNARY_POSTFIX];
};

/**
 * Generator: math_atan2
 * Arctangent of y/x in degrees
 */
Arduino.forBlock['math_atan2'] = function(block: Blockly.Block): [string, number] {
  const argument0 = Arduino.valueToCode(block, 'X', Order.NONE) || '0';
  const argument1 = Arduino.valueToCode(block, 'Y', Order.NONE) || '0';
  const code = `atan2(${argument1}, ${argument0}) / M_PI * 180`;
  return [code, Order.MULTIPLICATIVE];
};
