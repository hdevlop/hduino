import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

// Helper function to check if a value is a valid number string
const isNumber = (value: string): boolean => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(value);
};

/**
 * Arduino code generators for control flow blocks
 */

/**
 * Generator: controls_if
 * Generates if/else if/else statements
 */
Arduino.forBlock['controls_if'] = function(block: Blockly.Block): string {
  let n = 0;
  let argument = Arduino.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
  let branch = Arduino.statementToCode(block, 'DO' + n);
  let code = `if (${argument}) {\n${branch}\n}`;

  // Handle else-if blocks
  for (n = 1; n <= (block as any).elseifCount_; n++) {
    argument = Arduino.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
    branch = Arduino.statementToCode(block, 'DO' + n);
    code += ` else if (${argument}) {\n${branch}}`;
  }

  // Handle else block
  if ((block as any).elseCount_) {
    branch = Arduino.statementToCode(block, 'ELSE');
    code += ` else {\n${branch}\n}`;
  }

  return code + '\n';
};

/**
 * Generator: controls_repeat
 * Repeat N times with field number
 */
Arduino.forBlock['controls_repeat'] = function(block: Blockly.Block): string {
  const repeats = block.getFieldValue('TIMES');
  let branch = Arduino.statementToCode(block, 'DO');

  if (Arduino.INFINITE_LOOP_TRAP) {
    branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }

  const loopVar = Arduino.nameDB_!.getDistinctName('count', Blockly.Names.NameType.VARIABLE);
  const code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;

  return code;
};

/**
 * Generator: controls_repeat_ext
 * Repeat N times with input value
 */
Arduino.forBlock['controls_repeat_ext'] = function(block: Blockly.Block): string {
  const repeats = Arduino.valueToCode(block, 'TIMES', Order.ASSIGNMENT) || '0';
  let branch = Arduino.statementToCode(block, 'DO');

  if (Arduino.INFINITE_LOOP_TRAP) {
    branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }

  const loopVar = Arduino.nameDB_.getName('count', Blockly.Names.NameType.VARIABLE);
  const code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;

  return code;
};

/**
 * Generator: controls_whileUntil
 * While/until loop
 */
Arduino.forBlock['controls_whileUntil'] = function(block: Blockly.Block): string {
  let argument0 = Arduino.valueToCode(block, 'BOOL', Order.NONE) || 'false';
  let branch = Arduino.statementToCode(block, 'DO');

  if (Arduino.INFINITE_LOOP_TRAP) {
    branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}'`) + branch;
  }

  if (block.getFieldValue('MODE') === 'UNTIL') {
    if (!argument0.match(/^\w+$/)) {
      argument0 = `(${argument0})`;
    }
    argument0 = `!${argument0}`;
  }

  return `while (${argument0}) {\n${branch}}\n`;
};

/**
 * Generator: controls_for
 * For loop with variable
 */
Arduino.forBlock['controls_for'] = function(block: Blockly.Block): string {
  const variable0 = Arduino.nameDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const argument0 = Arduino.valueToCode(block, 'FROM', Order.ASSIGNMENT) || '0';
  const argument1 = Arduino.valueToCode(block, 'TO', Order.ASSIGNMENT) || '0';
  const increment = Arduino.valueToCode(block, 'BY', Order.ASSIGNMENT) || '1';

  let branch = Arduino.statementToCode(block, 'DO');
  branch = Arduino.addLoopTrap(branch, block);

  let code = '';

  // Check if connected blocks include digitalwrite for pinMode setup
  let connectedBlock = '';
  let child = block.getChildren(false)[3];
  while (child != null) {
    connectedBlock += child.type + ',';
    child = child.getNextBlock();
  }

  if (connectedBlock.includes('digitalwrite')) {
    const up = parseFloat(argument0) <= parseFloat(argument1);
    let setupCode = `  for (int ${variable0} = ${argument0}; ${variable0}${
      up ? ' <= ' : ' >= '
    }${argument1}; ${variable0}`;

    const step = Math.abs(parseFloat(increment));
    if (step === 1) {
      setupCode += up ? '++' : '--';
    } else {
      setupCode += (up ? ' += ' : ' -= ') + step;
    }
    setupCode += `) {\n    pinMode(${variable0}, OUTPUT);\n  }\n`;

    Arduino.addSetup('io_' + variable0, setupCode, false);
  }

  // Generate the main for loop
  if (isNumber(argument0) && isNumber(argument1) && isNumber(increment)) {
    const up = parseFloat(argument0) <= parseFloat(argument1);
    code = `for (int ${variable0} = ${argument0}; ${variable0}${
      up ? ' <= ' : ' >= '
    }${argument1}; ${variable0}`;

    const step = Math.abs(parseFloat(increment));
    if (step === 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += `) {\n${branch}}\n`;
  }

  return code;
};

/**
 * Generator: controls_flow_statements
 * Break/continue statements
 */
Arduino.forBlock['controls_flow_statements'] = function(block: Blockly.Block): string {
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw new Error('Unknown flow statement.');
};
