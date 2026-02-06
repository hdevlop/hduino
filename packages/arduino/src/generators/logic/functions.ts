import * as Blockly from 'blockly/core';
import { arduinoGenerator as Arduino, Order } from '../../arduino/generator';

/**
 * Arduino code generators for procedure/function blocks
 */

/**
 * Generator: procedures_defreturn
 * Defines a function with an optional return value.
 * Also used for procedures_defnoreturn.
 */
Arduino.forBlock['procedures_defreturn'] = function(block: Blockly.Block): null {
  const funcName = Arduino.nameDB_!.getName(
    block.getFieldValue('NAME'),
    Blockly.Names.NameType.PROCEDURE
  );
  let branch = Arduino.statementToCode(block, 'STACK');

  if (Arduino.STATEMENT_PREFIX) {
    const id = block.id.replace(/\$/g, '$$$$');
    branch =
      Arduino.prefixLines(
        Arduino.STATEMENT_PREFIX.replace(/%1/g, "'" + id + "'"),
        Arduino.INDENT
      ) + branch;
  }
  if (Arduino.INFINITE_LOOP_TRAP) {
    branch =
      Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
  }

  let returnValue = Arduino.valueToCode(block, 'RETURN', Order.NONE) || '';
  if (returnValue) {
    returnValue = Arduino.INDENT + 'return ' + returnValue + ';\n';
  }

  const returnType = returnValue ? 'int' : 'void';
  const args: string[] = [];
  for (let i = 0; i < (block as any).arguments_.length; i++) {
    args[i] =
      'int ' +
      Arduino.nameDB_!.getName(
        (block as any).arguments_[i],
        Blockly.Names.NameType.VARIABLE
      );
  }

  let code =
    returnType +
    ' ' +
    funcName +
    '(' +
    args.join(', ') +
    ') {\n' +
    branch +
    returnValue +
    '}\n';
  code = Arduino.scrub_(block, code);

  // Add with % prefix so it doesn't collide with helper functions
  Arduino.addDeclaration('%' + funcName, code);
  return null;
};

/**
 * Generator: procedures_defnoreturn
 * Delegates to procedures_defreturn (same logic, void return)
 */
Arduino.forBlock['procedures_defnoreturn'] = Arduino.forBlock['procedures_defreturn'];

/**
 * Generator: procedures_callreturn
 * Calls a function and returns its value
 */
Arduino.forBlock['procedures_callreturn'] = function(block: Blockly.Block): [string, number] {
  const funcName = Arduino.nameDB_!.getName(
    block.getFieldValue('NAME'),
    Blockly.Names.NameType.PROCEDURE
  );
  const args: string[] = [];
  for (let i = 0; i < (block as any).arguments_.length; i++) {
    args[i] = Arduino.valueToCode(block, 'ARG' + i, Order.COMMA) || 'null';
  }
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, Order.FUNCTION_CALL];
};

/**
 * Generator: procedures_callnoreturn
 * Calls a function without capturing a return value
 */
Arduino.forBlock['procedures_callnoreturn'] = function(block: Blockly.Block): string {
  const funcName = Arduino.nameDB_!.getName(
    block.getFieldValue('NAME'),
    Blockly.Names.NameType.PROCEDURE
  );
  const args: string[] = [];
  for (let i = 0; i < (block as any).arguments_.length; i++) {
    args[i] = Arduino.valueToCode(block, 'ARG' + i, Order.COMMA) || 'null';
  }
  return funcName + '(' + args.join(', ') + ');\n';
};

/**
 * Generator: procedures_ifreturn
 * Conditionally returns a value from a function
 */
Arduino.forBlock['procedures_ifreturn'] = function(block: Blockly.Block): string {
  const condition = Arduino.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  let code = 'if (' + condition + ') {\n';
  if ((block as any).hasReturnValue_) {
    const value = Arduino.valueToCode(block, 'VALUE', Order.NONE) || 'null';
    code += Arduino.INDENT + 'return ' + value + ';\n';
  } else {
    code += Arduino.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
